import { vi } from 'vitest';
import type { BTCPayContextType } from '@/contexts/btcpay-context';
import type { AppContextType } from '@/contexts/app-context';
import type { PurchaseContextType } from '@/contexts/purchase-context';
import type { BTCPayInvoice } from '@/types';

export const mockPackage = {
  id: 1,
  coins: 1000,
  price: 0.1,
  btcPrice: 0.005,
  usdPrice: 200,
};

export const mockWeb3Provider = {
  account: '0x123',
  chainId: 1,
  isConnecting: false,
  connectWallet: vi.fn(),
  disconnectWallet: vi.fn(),
  sendTransaction: vi.fn(),
};

export const mockBTCPayInvoice: BTCPayInvoice = {
  id: 'test-invoice',
  checkoutLink: 'https://test.com/invoice',
  status: 'New',
  amount: '0.005',
  currency: 'BTC',
  metadata: {
    packageId: 1,
    coins: 1000,
  },
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
};

export const mockBTCPayContext: BTCPayContextType = {
  createInvoice: vi.fn().mockResolvedValue(mockBTCPayInvoice),
  checkInvoiceStatus: vi.fn().mockResolvedValue(mockBTCPayInvoice),
  currentInvoice: null,
  isLoading: false,
};

export const mockAppProvider: AppContextType = {
  error: null,
  setError: vi.fn(),
  clearError: vi.fn(),
};

export const mockPurchaseProvider: PurchaseContextType = {
  selectedPackage: null,
  paymentMethod: 'eth',
  isProcessing: false,
  activeInvoiceId: null,
  setSelectedPackage: vi.fn(),
  setPaymentMethod: vi.fn(),
  setIsProcessing: vi.fn(),
  setActiveInvoiceId: vi.fn(),
  resetPurchaseState: vi.fn(),
};

export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

export function createMockApi() {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  };
} 