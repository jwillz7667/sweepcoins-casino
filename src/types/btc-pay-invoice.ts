export interface BTCPayInvoice {
  id: string;
  status: string;
  checkoutLink: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
} 