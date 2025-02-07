import { BTCPayMetadata } from '@/contexts/btcpay-context';

export interface Package {
  id: number;
  coins: number;
  price: number;
  btcPrice: number;
  usdPrice: number;
  freeSC?: number;
  tag?: string | null;
}

export interface BTCPayInvoice {
  id: string;
  checkoutLink: string;
  status: 'New' | 'Processing' | 'Settled' | 'Expired';
  amount: string;
  currency: string;
  metadata: BTCPayMetadata;
  createdAt: string;
  expiresAt: string;
}

export interface PurchaseIntent {
  id: string;
  packageId: number;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface AsyncResult<T> {
  success: boolean;
  error?: Error;
  data?: T;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: Error;
}

// Re-export BTCPay types for backward compatibility
export * from './btcpay'; 