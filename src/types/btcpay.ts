export interface BTCPayMetadata {
  userId?: string;
  packageId?: string;
  coins?: number;
  intentId?: string;
  orderId?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export type InvoiceStatus = 'New' | 'Processing' | 'Settled' | 'Invalid' | 'Expired';

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
  metadata?: BTCPayMetadata;
  checkout?: {
    speedPolicy?: 'HighSpeed' | 'MediumSpeed' | 'LowSpeed' | 'LowMediumSpeed';
    paymentMethods?: string[];
    expirationMinutes?: number;
    monitoringMinutes?: number;
    paymentTolerance?: number;
    redirectURL?: string;
    redirectAutomatically?: boolean;
    defaultLanguage?: string;
  };
}

export interface BTCPayPaymentMethod {
  paymentMethod: string;
  cryptoCode: string;
  destination: string;
  paymentLink: string;
  rate: number;
  paymentMethodPaid: string;
  totalPaid: string;
  due: string;
  amount: string;
  networkFee: string;
  payments: Array<{
    id: string;
    receivedDate: string;
    value: string;
    fee: string;
    status: string;
    destination: string;
  }>;
}

export interface BTCPayInvoice {
  id: string;
  storeId: string;
  amount: number;
  currency: string;
  type: 'Standard' | 'TopUp';
  checkoutLink: string;
  status: InvoiceStatus;
  additionalStatus: string;
  monitoringExpiration: string;
  expirationTime: string;
  createdTime: string;
  metadata?: BTCPayMetadata;
  availableStatusesForManualMarking: string[];
  archived: boolean;
  createdAt: string;
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
  secret?: string;
}

export interface BTCPayWebhookDelivery {
  id: string;
  timestamp: string;
  httpCode: number;
  errorMessage: string | null;
  status: 'Failed' | 'Complete';
  webhookId: string;
  deliveryId: string;
  webhookEvent: {
    deliveryId: string;
    webhookId: string;
    originalDeliveryId: string;
    isRedelivery: boolean;
    type: string;
    timestamp: string;
    storeId: string;
    invoiceId: string;
  };
}

export interface BTCPayRefundRequest {
  amount?: number;
  description?: string;
  paymentMethod?: string;
}

export interface BTCPayRefundResponse {
  id: string;
  invoiceId: string;
  paymentMethod: string;
  status: 'New' | 'Processing' | 'Completed' | 'Failed';
  amount: number;
  description: string;
  createdAt: string;
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
  archiveInvoice(invoiceId: string): Promise<void>;
  unarchiveInvoice(invoiceId: string): Promise<void>;
  markInvoiceStatus(invoiceId: string, status: 'Invalid' | 'Settled'): Promise<void>;
  getInvoicePaymentMethods(invoiceId: string): Promise<BTCPayPaymentMethod[]>;
  getRefunds(invoiceId: string): Promise<BTCPayRefundResponse[]>;
  cancelInvoice(invoiceId: string): Promise<void>;
  updateInvoiceMetadata(invoiceId: string, metadata: Record<string, unknown>): Promise<void>;
  subscribeToInvoiceStatus(
    invoiceId: string,
    callback: (status: InvoiceStatus) => void
  ): () => void;
} 