import { BTCPayInvoice } from '@/types';

export interface BTCPayMetadata {
  packageId: number;
  coins: number;
  intentId?: string;
  [key: string]: number | string | undefined;
}

export interface BTCPayContextType {
  createInvoice: (params: {
    price: number;
    currency: string;
    orderId: string;
    metadata: BTCPayMetadata;
  }) => Promise<BTCPayInvoice>;
  checkInvoiceStatus: (invoiceId: string) => Promise<BTCPayInvoice>;
  currentInvoice: BTCPayInvoice | null;
  isLoading: boolean;
} 