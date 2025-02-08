export interface BTCPayMetadata {
  packageId: string;
  coins: number;
  userId?: string;
  intentId?: string;
  orderId?: string;
  [key: string]: string | number | undefined;
}

export type InvoiceStatus = 
  | 'New' 
  | 'Processing' 
  | 'Settled' 
  | 'Expired' 
  | 'Invalid';

export interface BTCPayInvoiceRequest {
  price: number;
  currency: string;
  metadata: {
    userId?: string;
    packageId?: string;
    coins?: number;
    orderId?: string;
    [key: string]: unknown;
  };
  redirectURL?: string;
  checkout?: {
    speedPolicy?: 'HighSpeed' | 'MediumSpeed' | 'LowSpeed' | 'LowMediumSpeed';
    defaultPaymentMethod?: string;
    expirationMinutes?: number;
    monitoringMinutes?: number;
    paymentMethods?: string[];
    paymentMethodCriteria?: string[];
  };
}

export interface BTCPayInvoice {
  id: string;
  status: InvoiceStatus;
  checkoutLink: string;
  amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  expiresAt: string;
  monitoringExpiration?: string;
  paymentMethods?: Array<{
    paymentMethod: string;
    cryptoCode: string;
    destination: string;
    rate: number;
    paymentLink?: string;
  }>;
}

export interface BTCPayWebhookPayload {
  id: string;
  type: string;
  timestamp: string;
  storeId: string;
  invoiceId: string;
  metadata: Record<string, unknown>;
  webhookId?: string;
  originalDeliveryId?: string;
  isRedelivery?: boolean;
  payment?: {
    value: number;
    currency: string;
    cryptoCode: string;
    destination: string;
  };
}

export interface BTCPayWebhookRequest {
  url: string;
  events: string[];
  enabled: boolean;
  automaticRedelivery: boolean;
  secret: string;
}

export interface BTCPayWebhookDelivery {
  id: string;
  timestamp: string;
  webhookId: string;
  success: boolean;
  errorMessage?: string;
  payload: BTCPayWebhookPayload;
  status: number;
}

export interface BTCPayRefundRequest {
  amount?: number;
  paymentMethod?: string;
  description?: string;
}

export interface BTCPayRefundResponse {
  id: string;
  invoiceId: string;
  status: 'New' | 'Pending' | 'Completed' | 'Failed';
  amount: number;
  description?: string;
  destination?: string;
}

export interface BTCPayServiceInterface {
  createInvoice(params: BTCPayInvoiceRequest): Promise<BTCPayInvoice>;
  getInvoice(invoiceId: string): Promise<BTCPayInvoice>;
  getWebhookDeliveries(): Promise<BTCPayWebhookDelivery[]>;
  createRefund(invoiceId: string, params?: BTCPayRefundRequest): Promise<BTCPayRefundResponse>;
  subscribeToInvoiceStatus(invoiceId: string, callback: (status: InvoiceStatus) => void): () => void;
  archiveInvoice?(invoiceId: string): Promise<void>;
  unarchiveInvoice?(invoiceId: string): Promise<void>;
  markInvoiceStatus?(invoiceId: string, status: 'Invalid' | 'Settled'): Promise<void>;
} 