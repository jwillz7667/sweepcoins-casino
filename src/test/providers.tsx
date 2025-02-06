import React from 'react';
import { Web3Provider } from '@/contexts/Web3Context';
import { BTCPayProvider } from '@/contexts/BTCPayContext';
import { AppProvider } from '@/contexts/AppContext';
import { PurchaseProvider } from '@/contexts/PurchaseContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { BTCPayContextType } from '@/contexts/BTCPayContext';
import type { AppContextType } from '@/contexts/AppContext';
import type { PurchaseContextType } from '@/contexts/PurchaseContext';

const mockAppContext: AppContextType = {
  error: null,
  setError: () => {},
  clearError: () => {},
};

const mockBTCPayContext: BTCPayContextType = {
  createInvoice: async () => ({
    id: 'mock-id',
    checkoutLink: 'mock-link',
    status: 'New',
    amount: '0.001',
    currency: 'BTC',
    metadata: { packageId: 1, coins: 1000 },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  }),
  checkInvoiceStatus: async () => ({
    id: 'mock-id',
    checkoutLink: 'mock-link',
    status: 'New',
    amount: '0.001',
    currency: 'BTC',
    metadata: { packageId: 1, coins: 1000 },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  }),
  currentInvoice: null,
  isLoading: false,
};

const mockPurchaseContext: PurchaseContextType = {
  selectedPackage: null,
  paymentMethod: 'eth',
  isProcessing: false,
  activeInvoiceId: null,
  setSelectedPackage: () => {},
  setPaymentMethod: () => {},
  setIsProcessing: () => {},
  setActiveInvoiceId: () => {},
  resetPurchaseState: () => {},
};

/**
 * Test provider wrapper for components that need context
 */
export const TestProviders = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <AppProvider value={mockAppContext}>
      <Web3Provider>
        <BTCPayProvider value={mockBTCPayContext}>
          <PurchaseProvider value={mockPurchaseContext}>
            {children}
          </PurchaseProvider>
        </BTCPayProvider>
      </Web3Provider>
    </AppProvider>
  </ErrorBoundary>
); 