import axios, { AxiosError, AxiosInstance } from 'axios';
import { 
  BTCPayInvoice, 
  BTCPayInvoiceRequest,
  BTCPayServiceInterface,
  BTCPayWebhookDelivery,
  BTCPayWebhookRequest,
  InvoiceStatus,
  BTCPayRefundRequest,
  BTCPayRefundResponse,
  BTCPayPaymentMethod,
  BTCPayError
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
  'InvoicePaymentSettled',
  'InvoicePaymentPending',
  'InvoicePaymentFailed',
  'InvoicePaymentCompleted'
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

class BTCPayServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'BTCPayServiceError';
  }
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
      throw new BTCPayServiceError(
        'BTCPay Server configuration is missing',
        'INVALID_CONFIG'
      );
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
      
      if (this.consecutiveRateLimits > MAX_CONSECUTIVE_RATE_LIMITS) {
        this.consecutiveRateLimits = 0;
        throw new BTCPayServiceError(
          'Maximum rate limit retries exceeded. Please try again later.',
          'RATE_LIMIT_EXCEEDED'
        );
      }

      let retryAfter: number;
      try {
        const headerValue = error.response.headers['retry-after'];
        retryAfter = headerValue ? parseInt(headerValue, 10) * 1000 : DEFAULT_RETRY_WAIT;
        
        if (isNaN(retryAfter) || retryAfter < MIN_RETRY_WAIT) {
          retryAfter = MIN_RETRY_WAIT;
        } else if (retryAfter > MAX_RETRY_WAIT) {
          retryAfter = MAX_RETRY_WAIT;
        }

        retryAfter = Math.min(retryAfter * Math.pow(2, this.consecutiveRateLimits - 1), MAX_RETRY_WAIT);
      } catch (e) {
        retryAfter = DEFAULT_RETRY_WAIT;
      }

      console.warn(`Rate limit exceeded. Waiting ${retryAfter/1000} seconds before retry. Attempt: ${this.consecutiveRateLimits}`);
      
      await new Promise(resolve => setTimeout(resolve, retryAfter));
      return this.axiosInstance.request(error.config!);
    }

    this.consecutiveRateLimits = 0;

    const btcPayError: BTCPayError = {
      code: 'UNKNOWN_ERROR',
      message: error.message
    };

    if (error.response?.data && typeof error.response.data === 'object') {
      const errorData = error.response.data as Record<string, unknown>;
      btcPayError.code = (errorData.code as string) || `HTTP_${error.response.status}`;
      btcPayError.message = (errorData.message as string) || error.message;
      btcPayError.details = errorData;
    }

    throw new BTCPayServiceError(
      btcPayError.message,
      btcPayError.code,
      btcPayError.details
    );
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
        w.url === import.meta.env.VITE_BTCPAY_WEBHOOK_URL
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
      url: import.meta.env.VITE_BTCPAY_WEBHOOK_URL,
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
      url: import.meta.env.VITE_BTCPAY_WEBHOOK_URL,
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
          throw new BTCPayServiceError(
            'Rate limit exceeded. Please try again later.',
            'RATE_LIMIT_EXCEEDED'
          );
        }

        this.addRequestTimestamp();

        const response = await this.axiosInstance.post(
          `/api/v1/stores/${this.storeId}/invoices`,
          {
            amount: params.price,
            currency: params.currency,
            metadata: params.metadata,
            checkout: params.checkout
          }
        );

        const invoice = response.data;
        this.setCachedInvoice(cacheKey, invoice);
        return invoice;
      } catch (error) {
        if (error instanceof BTCPayServiceError && error.code === 'RATE_LIMIT_EXCEEDED') {
          throw error;
        }

        if (attempt === RETRY_DELAYS.length) {
          throw error;
        }

        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]));
      }
    }

    throw new BTCPayServiceError(
      'Failed to create invoice after multiple retries',
      'CREATE_INVOICE_FAILED'
    );
  }

  async getInvoice(invoiceId: string): Promise<BTCPayInvoice> {
    try {
      const response = await this.axiosInstance.get(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof BTCPayServiceError) {
        throw error;
      }
      throw new BTCPayServiceError(
        'Failed to fetch invoice',
        'GET_INVOICE_FAILED'
      );
    }
  }

  async getWebhookDeliveries(): Promise<BTCPayWebhookDelivery[]> {
    if (!this.currentWebhookId) {
      throw new BTCPayServiceError(
        'Webhook not initialized',
        'WEBHOOK_NOT_INITIALIZED'
      );
    }

    try {
      const response = await this.axiosInstance.get(
        `/api/v1/stores/${this.storeId}/webhooks/${this.currentWebhookId}/deliveries`
      );
      return response.data;
    } catch (error) {
      if (error instanceof BTCPayServiceError) {
        throw error;
      }
      throw new BTCPayServiceError(
        'Failed to fetch webhook deliveries',
        'GET_WEBHOOK_DELIVERIES_FAILED'
      );
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
      if (error instanceof BTCPayServiceError) {
        throw error;
      }
      throw new BTCPayServiceError(
        'Failed to create refund',
        'CREATE_REFUND_FAILED'
      );
    }
  }

  async archiveInvoice(invoiceId: string): Promise<void> {
    try {
      await this.axiosInstance.post(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}/archive`
      );
    } catch (error) {
      if (error instanceof BTCPayServiceError) {
        throw error;
      }
      throw new BTCPayServiceError(
        'Failed to archive invoice',
        'ARCHIVE_INVOICE_FAILED'
      );
    }
  }

  async unarchiveInvoice(invoiceId: string): Promise<void> {
    try {
      await this.axiosInstance.post(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}/unarchive`
      );
    } catch (error) {
      if (error instanceof BTCPayServiceError) {
        throw error;
      }
      throw new BTCPayServiceError(
        'Failed to unarchive invoice',
        'UNARCHIVE_INVOICE_FAILED'
      );
    }
  }

  async markInvoiceStatus(invoiceId: string, status: 'Invalid' | 'Settled'): Promise<void> {
    try {
      await this.axiosInstance.post(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}/status`,
        { status }
      );
    } catch (error) {
      if (error instanceof BTCPayServiceError) {
        throw error;
      }
      throw new BTCPayServiceError(
        'Failed to mark invoice status',
        'MARK_INVOICE_STATUS_FAILED'
      );
    }
  }

  async getInvoicePaymentMethods(invoiceId: string): Promise<BTCPayPaymentMethod[]> {
    try {
      const response = await this.axiosInstance.get(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}/payment-methods`
      );
      return response.data;
    } catch (error) {
      if (error instanceof BTCPayServiceError) {
        throw error;
      }
      throw new BTCPayServiceError(
        'Failed to get invoice payment methods',
        'GET_PAYMENT_METHODS_FAILED'
      );
    }
  }

  async getRefunds(invoiceId: string): Promise<BTCPayRefundResponse[]> {
    try {
      const response = await this.axiosInstance.get(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}/refunds`
      );
      return response.data;
    } catch (error) {
      if (error instanceof BTCPayServiceError) {
        throw error;
      }
      throw new BTCPayServiceError(
        'Failed to get refunds',
        'GET_REFUNDS_FAILED'
      );
    }
  }

  async cancelInvoice(invoiceId: string): Promise<void> {
    try {
      await this.axiosInstance.post(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}/cancel`
      );
    } catch (error) {
      if (error instanceof BTCPayServiceError) {
        throw error;
      }
      throw new BTCPayServiceError(
        'Failed to cancel invoice',
        'CANCEL_INVOICE_FAILED'
      );
    }
  }

  async updateInvoiceMetadata(invoiceId: string, metadata: Record<string, unknown>): Promise<void> {
    try {
      await this.axiosInstance.put(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}/metadata`,
        metadata
      );
    } catch (error) {
      if (error instanceof BTCPayServiceError) {
        throw error;
      }
      throw new BTCPayServiceError(
        'Failed to update invoice metadata',
        'UPDATE_METADATA_FAILED'
      );
    }
  }

  subscribeToInvoiceStatus(
    invoiceId: string,
    callback: (status: InvoiceStatus) => void
  ): () => void {
    const listeners = this.statusListeners.get(invoiceId) || [];
    listeners.push(callback);
    this.statusListeners.set(invoiceId, listeners);

    // Start polling if not already polling for this invoice
    if (listeners.length === 1) {
      this.pollInvoiceStatus(invoiceId);
    }

    // Return unsubscribe function
    return () => {
      const currentListeners = this.statusListeners.get(invoiceId) || [];
      const index = currentListeners.indexOf(callback);
      if (index > -1) {
        currentListeners.splice(index, 1);
        if (currentListeners.length === 0) {
          this.statusListeners.delete(invoiceId);
        } else {
          this.statusListeners.set(invoiceId, currentListeners);
        }
      }
    };
  }

  private async pollInvoiceStatus(invoiceId: string): Promise<void> {
    const startTime = Date.now();
    let lastStatus: InvoiceStatus | null = null;

    const poll = async () => {
      try {
        // Stop polling if no listeners or max duration reached
        if (
          !this.statusListeners.has(invoiceId) ||
          Date.now() - startTime > MAX_POLL_DURATION
        ) {
          return;
        }

        const invoice = await this.getInvoice(invoiceId);
        
        // Notify listeners if status changed
        if (invoice.status !== lastStatus) {
          lastStatus = invoice.status;
          const listeners = this.statusListeners.get(invoiceId) || [];
          listeners.forEach(callback => callback(invoice.status));
        }

        // Continue polling if invoice is not in final state
        if (!['Settled', 'Invalid', 'Expired'].includes(invoice.status)) {
          setTimeout(poll, INVOICE_POLL_INTERVAL);
        } else {
          this.statusListeners.delete(invoiceId);
        }
      } catch (error) {
        console.error(`Error polling invoice ${invoiceId}:`, error);
        setTimeout(poll, INVOICE_POLL_INTERVAL);
      }
    };

    await poll();
  }
}

export const btcPayService = new BTCPayService(); 