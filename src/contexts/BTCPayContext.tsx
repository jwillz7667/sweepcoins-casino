import { createContext, useContext } from 'react';
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

export const BTCPayContext = createContext<BTCPayContextType | null>(null);

export const BTCPayProvider = BTCPayContext.Provider;

export const useBTCPay = () => {
  const context = useContext(BTCPayContext);
  if (!context) {
    throw new Error('useBTCPay must be used within a BTCPayProvider');
  }
  return context;
}; 