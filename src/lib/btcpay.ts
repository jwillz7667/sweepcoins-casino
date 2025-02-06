import axios, { AxiosError } from 'axios';
import { 
  BTCPayInvoice, 
  BTCPayInvoiceRequest,
  BTCPayServiceInterface,
  BTCPayWebhookDelivery
} from '@/types/btcpay';

export class BTCPayService implements BTCPayServiceInterface {
  private readonly apiKey: string;
  private readonly serverUrl: string;
  private readonly storeId: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_BTCPAY_API_KEY || '';
    this.serverUrl = import.meta.env.VITE_BTCPAY_SERVER_URL || '';
    this.storeId = import.meta.env.VITE_BTCPAY_STORE_ID || '';

    if (!this.apiKey || !this.serverUrl || !this.storeId) {
      throw new Error('BTCPay Server configuration is missing. Please check your environment variables: VITE_BTCPAY_API_KEY, VITE_BTCPAY_SERVER_URL, VITE_BTCPAY_STORE_ID');
    }
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

  async createInvoice(params: BTCPayInvoiceRequest): Promise<BTCPayInvoice> {
    try {
      console.log('Creating BTCPay invoice with params:', {
        ...params,
        metadata: {
          ...params.metadata,
          packageId: params.metadata.packageId ? '***' : undefined,
          coins: params.metadata.coins ? '***' : undefined
        }
      });

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
        const axiosError = error as AxiosError<{ message?: string }>;
        console.error('BTCPay createInvoice error:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          config: {
            url: axiosError.config?.url,
            method: axiosError.config?.method,
            headers: {
              ...axiosError.config?.headers,
              Authorization: '***' // Hide sensitive data
            }
          }
        });
        throw new Error(`Failed to create BTCPay invoice: ${axiosError.response?.data?.message || axiosError.message}`);
      }
      console.error('BTCPay createInvoice unknown error:', error);
      throw new Error('Failed to create BTCPay invoice: Unknown error occurred');
    }
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
      };
    } catch (error) {
      console.error('BTCPay getInvoice error:', error);
      throw new Error('Failed to get BTCPay invoice');
    }
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
}

export const btcPayService = new BTCPayService(); 