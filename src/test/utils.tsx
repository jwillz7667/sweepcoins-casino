import React from 'react';
import { render as baseRender, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { Web3Context } from '@/contexts/Web3Context';
import { BTCPayProvider } from '@/contexts/BTCPayContext';
import { AppProvider } from '@/contexts/AppContext';
import { PurchaseProvider } from '@/contexts/PurchaseContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { BTCPayContextType } from '@/contexts/BTCPayContext';
import type { AppContextType } from '@/contexts/AppContext';
import type { PurchaseContextType } from '@/contexts/PurchaseContext';
import type { Package, BTCPayInvoice } from '@/types';

interface TestContextState {
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

interface ProvidersProps {
  children: React.ReactNode;
  state?: TestContextState;
}

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

export const mockBTCPayProvider: BTCPayContextType = {
  createInvoice: vi.fn().mockImplementation(async () => ({} as BTCPayInvoice)),
  checkInvoiceStatus: vi.fn().mockImplementation(async () => ({} as BTCPayInvoice)),
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

export function createMockStore() {
  const store = {
    getState: vi.fn(),
    setState: vi.fn(),
    subscribe: vi.fn(),
    destroy: vi.fn(),
  };
  return store;
}

export const mockPerformanceMetrics = {
  startTrace: vi.fn(() => 'test-trace-id'),
  endTrace: vi.fn(),
  recordMetric: vi.fn(),
  measureAsyncOperation: vi.fn((operation) => operation()),
  measureSyncOperation: vi.fn((operation) => operation()),
};

export const mockErrorTracking = {
  captureError: vi.fn((error) => error),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
  clearUser: vi.fn(),
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

export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

interface CustomRenderOptions {
  state?: TestContextState;
  initialState?: TestContextState;
  wrapper?: React.ComponentType;
}

const TestProviders = ({ children, state = {} }: ProvidersProps) => {
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
          <BTCPayProvider value={mockBTCPayProvider}>
            <PurchaseProvider value={purchaseValue}>
              {children}
            </PurchaseProvider>
          </BTCPayProvider>
        </Web3Context.Provider>
      </AppProvider>
    </ErrorBoundary>
  );
};

const render = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { state, ...renderOptions } = options;
  return baseRender(ui, {
    wrapper: (props: ProvidersProps) => <TestProviders {...props} state={state} />,
    ...renderOptions,
  });
};

export { render as customRender };
export * from '@testing-library/react';

/**
 * Custom renderer that wraps the UI with all necessary providers
 */
const AllTheProviders: React.FC<{ children: React.ReactNode; initialState?: CustomRenderOptions['initialState'] }> = ({
  children,
  initialState = {},
}) => {
  return (
    <ErrorBoundary>
      <AppProvider value={mockAppProvider}>
        <Web3Context.Provider value={mockWeb3Provider}>
          <BTCPayProvider value={mockBTCPayProvider}>
            <PurchaseProvider value={mockPurchaseProvider}>
              {children}
            </PurchaseProvider>
          </BTCPayProvider>
        </Web3Context.Provider>
      </AppProvider>
    </ErrorBoundary>
  );
};

const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions & Omit<RenderOptions, 'wrapper'> = {}
) => {
  const { initialState, ...renderOptions } = options;
  return baseRender(ui, {
    wrapper: (props: { children: React.ReactNode }) => <AllTheProviders {...props} initialState={initialState} />,
    ...renderOptions,
  });
};

/**
 * Basic test wrapper with error boundary
 */
const TestWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
);

/**
 * Custom render method
 */
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestWrapper, ...options }); 