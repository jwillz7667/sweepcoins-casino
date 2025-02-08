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

export type PaymentStatus = 
  | 'New'
  | 'Pending'
  | 'Completed'
  | 'Failed';

export type SpeedPolicy = 
  | 'HighSpeed' 
  | 'MediumSpeed' 
  | 'LowSpeed' 
  | 'LowMediumSpeed';

export interface BTCPayCheckoutOptions {
  speedPolicy?: SpeedPolicy;
  defaultPaymentMethod?: string;
  expirationMinutes?: number;
  monitoringMinutes?: number;
  paymentMethods?: string[];
  paymentMethodCriteria?: string[];
  redirectURL?: string;
  redirectAutomatically?: boolean;
  requiresRefundEmail?: boolean;
  defaultLanguage?: string;
}

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
  checkout?: BTCPayCheckoutOptions;
  redirectURL?: string;
}

export interface BTCPayPaymentMethod {
  paymentMethod: string;
  cryptoCode: string;
  destination: string;
  rate: number;
  paymentLink?: string;
  amount?: string;
  due?: string;
  totalPaid?: string;
  networkFee?: string;
  payments?: Array<{
    id: string;
    receivedDate: string;
    value: string;
    fee?: string;
    status: PaymentStatus;
    destination: string;
  }>;
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
  paymentMethods?: BTCPayPaymentMethod[];
  additionalStatus?: string;
  availableStatusesForManualMarking?: string[];
  archived?: boolean;
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
    status?: PaymentStatus;
    transactionId?: string;
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
  httpCode?: number;
  attemptCount?: number;
  nextRetry?: string;
}

export interface BTCPayRefundRequest {
  amount?: number;
  paymentMethod?: string;
  description?: string;
  paymentMethodCriteria?: string[];
}

export interface BTCPayRefundResponse {
  id: string;
  invoiceId: string;
  status: PaymentStatus;
  amount: number;
  description?: string;
  destination?: string;
  paymentMethod?: string;
  rate?: number;
  transactionId?: string;
}

export interface BTCPayError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface BTCPayServiceInterface {
  createInvoice(params: BTCPayInvoiceRequest): Promise<BTCPayInvoice>;
  getInvoice(invoiceId: string): Promise<BTCPayInvoice>;
  getWebhookDeliveries(): Promise<BTCPayWebhookDelivery[]>;
  createRefund(invoiceId: string, params?: BTCPayRefundRequest): Promise<BTCPayRefundResponse>;
  subscribeToInvoiceStatus(invoiceId: string, callback: (status: InvoiceStatus) => void): () => void;
  archiveInvoice(invoiceId: string): Promise<void>;
  unarchiveInvoice(invoiceId: string): Promise<void>;
  markInvoiceStatus(invoiceId: string, status: 'Invalid' | 'Settled'): Promise<void>;
  getInvoicePaymentMethods(invoiceId: string): Promise<BTCPayPaymentMethod[]>;
  getRefunds(invoiceId: string): Promise<BTCPayRefundResponse[]>;
  cancelInvoice(invoiceId: string): Promise<void>;
  updateInvoiceMetadata(invoiceId: string, metadata: Record<string, unknown>): Promise<void>;
} 