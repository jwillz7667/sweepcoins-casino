export interface BTCPayMetadata {
  packageId: string;
  coins: number;
  userId?: string;
  intentId?: string;
}

export type InvoiceStatus = 
  | 'New'
  | 'Processing'
  | 'Expired'
  | 'Invalid'
  | 'Settled'
  | 'Processing';

export interface BTCPayInvoiceRequest {
  price: number;
  currency: string;
  metadata: {
    userId?: string;
    packageId?: string;
    coins?: number;
    [key: string]: any;
  };
  redirectURL?: string;
}

export interface BTCPayInvoice {
  id: string;
  status: InvoiceStatus;
  checkoutLink: string;
  amount: number;
  currency: string;
  metadata: {
    userId?: string;
    packageId?: string;
    coins?: number;
    [key: string]: any;
  };
  createdAt: string;
  expiresAt: string;
}

export interface BTCPayWebhookPayload {
  id: string;
  type: string;
  timestamp: string;
  storeId: string;
  invoiceId: string;
  metadata: BTCPayMetadata;
}

export interface BTCPayWebhookDelivery {
  id: string;
  timestamp: string;
  type: string;
  status: 'New' | 'Complete' | 'Failed';
  error?: string;
}

export interface BTCPayWebhookRequest {
  url: string;
  events: string[];
  enabled: boolean;
  automaticRedelivery: boolean;
  secret: string;
}

export interface BTCPayServiceInterface {
  createInvoice(params: BTCPayInvoiceRequest): Promise<BTCPayInvoice>;
  getInvoice(invoiceId: string): Promise<BTCPayInvoice>;
  getWebhookDeliveries(webhookId: string): Promise<BTCPayWebhookDelivery[]>;
  createRefund(invoiceId: string, amount?: number): Promise<BTCPayRefundResponse>;
  subscribeToInvoiceStatus(invoiceId: string, callback: (status: InvoiceStatus) => void): () => void;
}

export interface BTCPayRefundResponse {
  id: string;
  status: 'New' | 'Processing' | 'Completed' | 'Failed';
  amount: number;
  currency: string;
  timestamp: string;
} 