export interface BTCPayMetadata {
  packageId?: string;
  coins?: number;
  userId?: string;
  email?: string;
  intentId?: string;
}

export interface BTCPayInvoiceRequest {
  price: number;
  currency: string;
  orderId: string;
  metadata: BTCPayMetadata;
  redirectURL?: string;
}

export interface BTCPayInvoice {
  id: string;
  status: string;
  checkoutLink: string;
  amount: string;
  currency: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  expiresAt: string;
}

export interface BTCPayWebhookDelivery {
  id: string;
  timestamp: string;
  status: 'Failed' | 'Complete';
  httpCode: number;
  errorMessage?: string;
  payload: Record<string, unknown>;
}

export interface BTCPayServiceInterface {
  createInvoice: (params: BTCPayInvoiceRequest) => Promise<BTCPayInvoice>;
  getInvoice: (invoiceId: string) => Promise<BTCPayInvoice>;
  getWebhookDeliveries: (webhookId: string) => Promise<BTCPayWebhookDelivery[]>;
} 