import React from 'react';
import { vi } from 'vitest';
import { Web3Context } from '@/contexts/web3-context';
import { BTCPayProvider, AppProvider, PurchaseProvider } from '@/contexts';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { TestContextState } from './types.ts';
import { mockBTCPayContext, mockAppProvider, mockPurchaseProvider, mockWeb3Provider } from './mocks.ts';

interface ProvidersProps {
  children: React.ReactNode;
  state?: TestContextState;
}

export const TestProviders = ({ children, state = {} }: ProvidersProps) => {
  const web3Value = {
    connectWallet: async () => {},
    disconnectWallet: async () => {},
    sendTransaction: async () => ({ success: false }),
  };

  const appValue = {
    error: state.app?.error ?? null,
    setError: vi.fn(),
    clearError: vi.fn(),
  };

  const purchaseValue = {
    selectedPackage: state.purchase?.selectedPackage ?? null,
    paymentMethod: state.purchase?.paymentMethod ?? 'eth',
    isProcessing: state.purchase?.isProcessing ?? false,
    activeInvoiceId: state.purchase?.activeInvoiceId ?? null,
    setSelectedPackage: vi.fn(),
    setPaymentMethod: vi.fn(),
    setIsProcessing: vi.fn(),
    setActiveInvoiceId: vi.fn(),
    resetPurchaseState: vi.fn(),
  };

  return (
    <ErrorBoundary>
      <AppProvider value={appValue}>
        <Web3Context.Provider value={web3Value}>
          <BTCPayProvider value={mockBTCPayContext}>
            <PurchaseProvider value={purchaseValue}>
              {children}
            </PurchaseProvider>
          </BTCPayProvider>
        </Web3Context.Provider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <ErrorBoundary>
      <AppProvider value={mockAppProvider}>
        <Web3Context.Provider value={mockWeb3Provider}>
          <BTCPayProvider value={mockBTCPayContext}>
            <PurchaseProvider value={mockPurchaseProvider}>
              {children}
            </PurchaseProvider>
          </BTCPayProvider>
        </Web3Context.Provider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export const TestWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
); 