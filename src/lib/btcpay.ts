import axios, { AxiosError, AxiosInstance } from 'axios';
import { 
  BTCPayInvoice, 
  BTCPayInvoiceRequest,
  BTCPayServiceInterface,
  BTCPayWebhookDelivery,
  BTCPayWebhookRequest,
  InvoiceStatus,
  BTCPayRefundRequest,
  BTCPayRefundResponse
} from '@/types/btcpay';

// Configuration constants
const RETRY_DELAYS = [1000, 2000, 4000, 8000]; // Exponential backoff
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;
const WEBHOOK_EVENTS = [
  'InvoiceCreated',
  'InvoiceReceivedPayment',
  'InvoiceProcessing',
  'InvoiceExpired',
  'InvoiceSettled',
  'InvoiceInvalid',
  'InvoicePaymentSettled'
];

// Rate limit handling constants
const MAX_RETRY_WAIT = 300000; // 5 minutes maximum wait
const MIN_RETRY_WAIT = 1000; // 1 second minimum wait
const DEFAULT_RETRY_WAIT = 60000; // 1 minute default wait
const MAX_CONSECUTIVE_RATE_LIMITS = 3; // Maximum number of consecutive rate limit retries

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const INVOICE_POLL_INTERVAL = 5000; // 5 seconds
const MAX_POLL_DURATION = 30 * 60 * 1000; // 30 minutes

interface BTCPayWebhookResponse {
  id: string;
  url: string;
  events: string[];
  enabled: boolean;
  automaticRedelivery: boolean;
}

export class BTCPayService implements BTCPayServiceInterface {
  private readonly apiKey: string;
  private readonly serverUrl: string;
  private readonly storeId: string;
  private readonly axiosInstance: AxiosInstance;
  private requestTimestamps: number[] = [];
  private consecutiveRateLimits = 0;
  private invoiceCache = new Map<string, { invoice: BTCPayInvoice; timestamp: number }>();
  private statusListeners = new Map<string, ((status: InvoiceStatus) => void)[]>();
  private currentWebhookId?: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_BTCPAY_API_KEY || '';
    this.serverUrl = import.meta.env.VITE_BTCPAY_SERVER_URL || '';
    this.storeId = import.meta.env.VITE_BTCPAY_STORE_ID || '';

    if (!this.apiKey || !this.serverUrl || !this.storeId) {
      throw new Error('BTCPay Server configuration is missing');
    }

    this.axiosInstance = axios.create({
      baseURL: this.serverUrl,
      headers: {
        'Authorization': `token ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      this.handleAxiosError.bind(this)
    );

    // Initialize webhook on service start
    this.initializeWebhook().catch(console.error);
  }

  private async handleAxiosError(error: AxiosError) {
    if (error.response?.status === 429) {
      this.consecutiveRateLimits++;
      
      // If we've hit too many consecutive rate limits, throw an error
      if (this.consecutiveRateLimits > MAX_CONSECUTIVE_RATE_LIMITS) {
        this.consecutiveRateLimits = 0;
        throw new Error('Maximum rate limit retries exceeded. Please try again later.');
      }

      // Get retry-after value from headers
      let retryAfter: number;
      try {
        const headerValue = error.response.headers['retry-after'];
        retryAfter = headerValue ? parseInt(headerValue, 10) * 1000 : DEFAULT_RETRY_WAIT;
        
        // Validate the retry-after value
        if (isNaN(retryAfter) || retryAfter < MIN_RETRY_WAIT) {
          retryAfter = MIN_RETRY_WAIT;
        } else if (retryAfter > MAX_RETRY_WAIT) {
          retryAfter = MAX_RETRY_WAIT;
        }

        // Apply exponential backoff based on consecutive rate limits
        retryAfter = Math.min(retryAfter * Math.pow(2, this.consecutiveRateLimits - 1), MAX_RETRY_WAIT);
      } catch (e) {
        retryAfter = DEFAULT_RETRY_WAIT;
      }

      console.warn(`Rate limit exceeded. Waiting ${retryAfter/1000} seconds before retry. Attempt: ${this.consecutiveRateLimits}`);
      
      await new Promise(resolve => setTimeout(resolve, retryAfter));
      return this.axiosInstance.request(error.config!);
    }

    // Reset consecutive rate limits on non-429 errors
    this.consecutiveRateLimits = 0;

    if (error.response?.status === 401) {
      console.error('BTCPay authentication failed. Please check your API key.');
    }

    throw error;
  }

  private isRateLimited(): boolean {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );
    return this.requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW;
  }

  private addRequestTimestamp(): void {
    this.requestTimestamps.push(Date.now());
  }

  private async initializeWebhook(): Promise<void> {
    try {
      const { data: webhooks } = await this.axiosInstance.get<BTCPayWebhookResponse[]>(
        `/api/v1/stores/${this.storeId}/webhooks`
      );

      const existingWebhook = webhooks.find((w: BTCPayWebhookResponse) => 
        w.url === `${window.location.origin}/api/btcpay/webhook`
      );

      if (existingWebhook) {
        this.currentWebhookId = existingWebhook.id;
        if (!this.areWebhookSettingsCorrect(existingWebhook)) {
          await this.updateWebhook(existingWebhook.id);
        }
      } else {
        const newWebhook = await this.createWebhook();
        this.currentWebhookId = newWebhook.id;
      }
    } catch (error) {
      console.error('Failed to initialize webhook:', error);
      throw error;
    }
  }

  private areWebhookSettingsCorrect(webhook: BTCPayWebhookResponse): boolean {
    return WEBHOOK_EVENTS.every(event => webhook.events.includes(event)) &&
           webhook.enabled === true &&
           webhook.automaticRedelivery === true;
  }

  private async createWebhook(): Promise<{ id: string }> {
    const webhookData: BTCPayWebhookRequest = {
      url: `${window.location.origin}/api/btcpay/webhook`,
      events: WEBHOOK_EVENTS,
      enabled: true,
      automaticRedelivery: true,
      secret: import.meta.env.VITE_BTCPAY_WEBHOOK_SECRET
    };

    const response = await this.axiosInstance.post(
      `/api/v1/stores/${this.storeId}/webhooks`,
      webhookData
    );

    return response.data;
  }

  private async updateWebhook(webhookId: string): Promise<void> {
    const webhookData: BTCPayWebhookRequest = {
      url: `${window.location.origin}/api/btcpay/webhook`,
      events: WEBHOOK_EVENTS,
      enabled: true,
      automaticRedelivery: true,
      secret: import.meta.env.VITE_BTCPAY_WEBHOOK_SECRET
    };

    await this.axiosInstance.put(
      `/api/v1/stores/${this.storeId}/webhooks/${webhookId}`,
      webhookData
    );
  }

  private getCachedInvoice(key: string): BTCPayInvoice | null {
    const cached = this.invoiceCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.invoice;
    }
    return null;
  }

  private setCachedInvoice(key: string, invoice: BTCPayInvoice): void {
    this.invoiceCache.set(key, { invoice, timestamp: Date.now() });
  }

  async createInvoice(params: BTCPayInvoiceRequest): Promise<BTCPayInvoice> {
    const cacheKey = JSON.stringify({
      price: params.price,
      currency: params.currency,
      metadata: params.metadata
    });

    const cachedInvoice = this.getCachedInvoice(cacheKey);
    if (cachedInvoice && !['Expired', 'Invalid'].includes(cachedInvoice.status)) {
      return cachedInvoice;
    }

    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      try {
        if (this.isRateLimited()) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        this.addRequestTimestamp();

        const response = await this.axiosInstance.post(
          `/api/v1/stores/${this.storeId}/invoices`,
          {
            amount: params.price,
            currency: params.currency,
            metadata: params.metadata,
            checkout: {
              redirectURL: params.redirectURL,
              defaultPaymentMethod: params.checkout?.defaultPaymentMethod || "BTC",
              expirationMinutes: params.checkout?.expirationMinutes || 30,
              monitoringMinutes: params.checkout?.monitoringMinutes || 60,
              speedPolicy: params.checkout?.speedPolicy || "MediumSpeed",
              paymentMethods: params.checkout?.paymentMethods,
              paymentMethodCriteria: params.checkout?.paymentMethodCriteria,
            },
          }
        );

        const invoice: BTCPayInvoice = {
          id: response.data.id,
          status: response.data.status,
          checkoutLink: response.data.checkoutLink,
          amount: response.data.amount,
          currency: response.data.currency,
          metadata: response.data.metadata,
          createdAt: response.data.createdTime,
          expiresAt: response.data.expirationTime,
          monitoringExpiration: response.data.monitoringExpiration,
          paymentMethods: response.data.paymentMethods,
        };

        this.setCachedInvoice(cacheKey, invoice);
        this.pollInvoiceStatus(invoice.id);
        return invoice;

      } catch (error) {
        if (attempt === RETRY_DELAYS.length) throw error;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]));
      }
    }

    throw new Error('Failed to create invoice after all retry attempts');
  }

  async getInvoice(invoiceId: string): Promise<BTCPayInvoice> {
    try {
      const response = await this.axiosInstance.get(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}`
      );

      return {
        id: response.data.id,
        status: response.data.status,
        checkoutLink: response.data.checkoutLink,
        amount: response.data.amount,
        currency: response.data.currency,
        metadata: response.data.metadata,
        createdAt: response.data.createdTime,
        expiresAt: response.data.expirationTime,
        monitoringExpiration: response.data.monitoringExpiration,
        paymentMethods: response.data.paymentMethods,
      };
    } catch (error) {
      console.error('Failed to get invoice:', error);
      throw error;
    }
  }

  async getWebhookDeliveries(): Promise<BTCPayWebhookDelivery[]> {
    try {
      if (!this.currentWebhookId) {
        await this.initializeWebhook();
      }
      const response = await this.axiosInstance.get(
        `/api/v1/stores/${this.storeId}/webhooks/${this.currentWebhookId}/deliveries`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get webhook deliveries:', error);
      throw error;
    }
  }

  async createRefund(invoiceId: string, params?: BTCPayRefundRequest): Promise<BTCPayRefundResponse> {
    try {
      const response = await this.axiosInstance.post(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}/refund`,
        params || {}
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create refund:', error);
      throw error;
    }
  }

  async archiveInvoice(invoiceId: string): Promise<void> {
    try {
      await this.axiosInstance.delete(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}`
      );
    } catch (error) {
      console.error('Failed to archive invoice:', error);
      throw error;
    }
  }

  async unarchiveInvoice(invoiceId: string): Promise<void> {
    try {
      await this.axiosInstance.post(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}/unarchive`
      );
    } catch (error) {
      console.error('Failed to unarchive invoice:', error);
      throw error;
    }
  }

  async markInvoiceStatus(invoiceId: string, status: 'Invalid' | 'Settled'): Promise<void> {
    try {
      await this.axiosInstance.post(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}/status`,
        { status }
      );
    } catch (error) {
      console.error(`Failed to mark invoice as ${status}:`, error);
      throw error;
    }
  }

  subscribeToInvoiceStatus(
    invoiceId: string,
    callback: (status: InvoiceStatus) => void
  ): () => void {
    const listeners = this.statusListeners.get(invoiceId) || [];
    listeners.push(callback);
    this.statusListeners.set(invoiceId, listeners);
    this.pollInvoiceStatus(invoiceId);

    return () => {
      const updatedListeners = this.statusListeners.get(invoiceId) || [];
      const index = updatedListeners.indexOf(callback);
      if (index !== -1) {
        updatedListeners.splice(index, 1);
        if (updatedListeners.length === 0) {
          this.statusListeners.delete(invoiceId);
        } else {
          this.statusListeners.set(invoiceId, updatedListeners);
        }
      }
    };
  }

  private async pollInvoiceStatus(invoiceId: string): Promise<void> {
    const startTime = Date.now();
    let lastStatus: InvoiceStatus | null = null;

    const poll = async () => {
      if (
        !this.statusListeners.has(invoiceId) ||
        Date.now() - startTime >= MAX_POLL_DURATION
      ) {
        return;
      }

      try {
        const invoice = await this.getInvoice(invoiceId);
        if (invoice.status !== lastStatus) {
          lastStatus = invoice.status;
          const listeners = this.statusListeners.get(invoiceId) || [];
          listeners.forEach(callback => callback(invoice.status));
        }

        if (['Settled', 'Invalid', 'Expired'].includes(invoice.status)) {
          this.statusListeners.delete(invoiceId);
          return;
        }

        setTimeout(poll, INVOICE_POLL_INTERVAL);
      } catch (error) {
        console.error(`Error polling invoice ${invoiceId}:`, error);
        setTimeout(poll, INVOICE_POLL_INTERVAL);
      }
    };

    poll();
  }
}

export const btcPayService = new BTCPayService(); 