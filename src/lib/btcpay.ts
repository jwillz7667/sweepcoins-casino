import axios, { AxiosError } from 'axios';

export type BTCPayInvoice = {
  id: string;
  status: 'New' | 'Processing' | 'Settled' | 'Expired';
  checkoutLink: string;
  amount: number;
  currency: string;
  orderId: string;
  createdAt: string;
};

export interface BTCPayMetadata {
  packageId?: number;
  coins?: number;
  buyerEmail?: string;
  [key: string]: string | number | undefined;
}

export type CreateInvoiceParams = {
  price: number;
  currency: string;
  orderId: string;
  buyerEmail?: string;
  redirectURL: string;
  metadata?: BTCPayMetadata;
};

class BTCPayService {
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

  async createInvoice(params: CreateInvoiceParams): Promise<BTCPayInvoice> {
    try {
      console.log('Creating BTCPay invoice with params:', {
        ...params,
        buyerEmail: params.buyerEmail ? '***' : undefined // Hide email in logs
      });

      const response = await this.axiosInstance.post(
        `/api/v1/stores/${this.storeId}/invoices`,
        {
          amount: params.price,
          currency: params.currency,
          orderId: params.orderId,
          redirectURL: params.redirectURL,
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

      console.log('BTCPay invoice created successfully:', response.data.id);
      
      return {
        id: response.data.id,
        status: response.data.status,
        checkoutLink: response.data.checkoutLink,
        amount: response.data.amount,
        currency: response.data.currency,
        orderId: response.data.orderId,
        createdAt: response.data.createdTime,
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
        orderId: response.data.orderId,
        createdAt: response.data.createdTime,
      };
    } catch (error) {
      console.error('BTCPay getInvoice error:', error);
      throw new Error('Failed to get BTCPay invoice');
    }
  }

  async getWebhookDeliveries(webhookId: string) {
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