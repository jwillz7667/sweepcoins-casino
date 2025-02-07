import type { Package } from '@/types';

export interface TestContextState {
  web3?: {
    account: string | null;
    chainId: number | null;
    isConnecting: boolean;
  };
  app?: {
    error: Error | null;
  };
  purchase?: {
    selectedPackage: Package | null;
    paymentMethod: 'eth' | 'btc';
    isProcessing: boolean;
    activeInvoiceId: string | null;
  };
} 