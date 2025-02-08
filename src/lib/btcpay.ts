import axios, { AxiosError } from 'axios';
import { 
  BTCPayInvoice, 
  BTCPayInvoiceRequest,
  BTCPayServiceInterface,
  BTCPayWebhookDelivery,
  BTCPayWebhookRequest,
  InvoiceStatus
} from '@/types/btcpay';

// Configuration constants
const RETRY_DELAYS = [1000, 2000, 4000];
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_WINDOW = 30;
const WEBHOOK_EVENTS = ['InvoiceCreated', 'InvoiceReceivedPayment', 'InvoiceProcessing', 'InvoiceExpired', 'InvoiceSettled', 'InvoiceInvalid'];

export class BTCPayService implements BTCPayServiceInterface {
  private readonly apiKey: string;
  private readonly serverUrl: string;
  private readonly storeId: string;
  private requestTimestamps: number[] = [];
  private invoiceCache = new Map<string, { invoice: BTCPayInvoice, timestamp: number }>();
  private statusListeners = new Map<string, ((status: InvoiceStatus) => void)[]>();

  constructor() {
    this.apiKey = import.meta.env.VITE_BTCPAY_API_KEY || '';
    this.serverUrl = import.meta.env.VITE_BTCPAY_SERVER_URL || '';
    this.storeId = import.meta.env.VITE_BTCPAY_STORE_ID || '';

    if (!this.apiKey || !this.serverUrl || !this.storeId) {
      throw new Error('BTCPay Server configuration is missing');
    }

    // Initialize webhook on service start
    this.initializeWebhook().catch(console.error);
  }

  private get axiosInstance() {
    return axios.create({
      baseURL: this.serverUrl,
      headers: {
        'Authorization': `token ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private async waitForRetry(attempt: number): Promise<void> {
    const delay = RETRY_DELAYS[attempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
    await new Promise(resolve => setTimeout(resolve, delay));
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

  private getCachedInvoice(key: string): BTCPayInvoice | null {
    const cached = this.invoiceCache.get(key);
    if (cached && Date.now() - cached.timestamp < 30000) { // 30 seconds cache
      return cached.invoice;
    }
    this.invoiceCache.delete(key);
    return null;
  }

  private setCachedInvoice(key: string, invoice: BTCPayInvoice): void {
    this.invoiceCache.set(key, { invoice, timestamp: Date.now() });
  }

  private async initializeWebhook(): Promise<void> {
    try {
      // Check existing webhooks
      const { data: webhooks } = await this.axiosInstance.get(
        `/api/v1/stores/${this.storeId}/webhooks`
      );

      const existingWebhook = webhooks.find((w: any) => 
        w.url === `${window.location.origin}/api/btcpay/webhook`
      );

      if (existingWebhook) {
        // Update existing webhook if needed
        if (!this.areWebhookSettingsCorrect(existingWebhook)) {
          await this.updateWebhook(existingWebhook.id);
        }
      } else {
        // Create new webhook
        await this.createWebhook();
      }
    } catch (error) {
      console.error('Failed to initialize webhook:', error);
    }
  }

  private areWebhookSettingsCorrect(webhook: any): boolean {
    return WEBHOOK_EVENTS.every(event => webhook.events.includes(event)) &&
           webhook.enabled === true &&
           webhook.automaticRedelivery === true;
  }

  private async createWebhook(): Promise<void> {
    const webhookData: BTCPayWebhookRequest = {
      url: `${window.location.origin}/api/btcpay/webhook`,
      events: WEBHOOK_EVENTS,
      enabled: true,
      automaticRedelivery: true,
      secret: import.meta.env.VITE_BTCPAY_WEBHOOK_SECRET
    };

    await this.axiosInstance.post(
      `/api/v1/stores/${this.storeId}/webhooks`,
      webhookData
    );
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

  public subscribeToInvoiceStatus(invoiceId: string, callback: (status: InvoiceStatus) => void): () => void {
    if (!this.statusListeners.has(invoiceId)) {
      this.statusListeners.set(invoiceId, []);
    }
    this.statusListeners.get(invoiceId)!.push(callback);

    // Start polling for status
    this.pollInvoiceStatus(invoiceId);

    // Return unsubscribe function
    return () => {
      const listeners = this.statusListeners.get(invoiceId) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      if (listeners.length === 0) {
        this.statusListeners.delete(invoiceId);
      }
    };
  }

  private async pollInvoiceStatus(invoiceId: string): Promise<void> {
    const POLL_INTERVAL = 5000; // 5 seconds
    const MAX_POLLS = 360; // 30 minutes maximum
    let polls = 0;

    const poll = async () => {
      if (!this.statusListeners.has(invoiceId) || polls >= MAX_POLLS) {
        return;
      }

      try {
        const invoice = await this.getInvoice(invoiceId);
        const listeners = this.statusListeners.get(invoiceId) || [];
        listeners.forEach(callback => callback(invoice.status));

        // Stop polling if in final state
        if (['Settled', 'Invalid', 'Expired'].includes(invoice.status)) {
          this.statusListeners.delete(invoiceId);
          return;
        }

        polls++;
        setTimeout(poll, POLL_INTERVAL);
      } catch (error) {
        console.error(`Error polling invoice ${invoiceId}:`, error);
        setTimeout(poll, POLL_INTERVAL);
      }
    };

    poll();
  }

  async createInvoice(params: BTCPayInvoiceRequest): Promise<BTCPayInvoice> {
    const cacheKey = JSON.stringify({
      price: params.price,
      currency: params.currency,
      metadata: params.metadata
    });

    const cachedInvoice = this.getCachedInvoice(cacheKey);
    if (cachedInvoice) {
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
              defaultPaymentMethod: "BTC",
              expirationMinutes: 30,
              monitoringMinutes: 60,
              speedPolicy: "MediumSpeed",
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
        };

        this.setCachedInvoice(cacheKey, invoice);
        return invoice;

      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message?: string }>;
          
          if (
            attempt === RETRY_DELAYS.length ||
            (axiosError.response?.status !== 429 &&
             axiosError.response?.status !== 500 &&
             axiosError.response?.status !== 503)
          ) {
            throw new Error(`Failed to create BTCPay invoice: ${axiosError.response?.data?.message || axiosError.message}`);
          }

          await this.waitForRetry(attempt);
          continue;
        }
        throw error;
      }
    }

    throw new Error('Failed to create BTCPay invoice after all retry attempts');
  }

  async getInvoice(invoiceId: string): Promise<BTCPayInvoice> {
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
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
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          
          if (
            attempt === RETRY_DELAYS.length ||
            (axiosError.response?.status !== 429 &&
             axiosError.response?.status !== 500 &&
             axiosError.response?.status !== 503)
          ) {
            throw new Error('Failed to get BTCPay invoice');
          }

          await this.waitForRetry(attempt);
          continue;
        }
        throw error;
      }
    }

    throw new Error('Failed to get BTCPay invoice after all retry attempts');
  }

  async getWebhookDeliveries(webhookId: string): Promise<BTCPayWebhookDelivery[]> {
    try {
      const response = await this.axiosInstance.get(
        `/api/v1/stores/${this.storeId}/webhooks/${webhookId}/deliveries`
      );
      return response.data;
    } catch (error) {
      console.error('BTCPay getWebhookDeliveries error:', error);
      throw new Error('Failed to get webhook deliveries');
    }
  }

  async createRefund(invoiceId: string, amount?: number): Promise<any> {
    try {
      const response = await this.axiosInstance.post(
        `/api/v1/stores/${this.storeId}/invoices/${invoiceId}/refund`,
        amount ? { amount } : {}
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create refund:', error);
      throw new Error('Failed to create refund');
    }
  }
}

export const btcPayService = new BTCPayService(); 