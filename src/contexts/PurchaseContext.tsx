import { createContext, useContext } from 'react';
import { Package } from '@/types';

export interface PurchaseContextType {
  selectedPackage: Package | null;
  paymentMethod: 'eth' | 'btc';
  isProcessing: boolean;
  activeInvoiceId: string | null;
  setSelectedPackage: (pkg: Package | null) => void;
  setPaymentMethod: (method: 'eth' | 'btc') => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setActiveInvoiceId: (id: string | null) => void;
  resetPurchaseState: () => void;
}

export const PurchaseContext = createContext<PurchaseContextType | null>(null);

export const PurchaseProvider = PurchaseContext.Provider;

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
}; 