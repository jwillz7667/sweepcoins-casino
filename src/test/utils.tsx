import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { Web3Provider } from '@/contexts/Web3Context';
import { BTCPayProvider } from '@/contexts/BTCPayContext';
import { AppProvider } from '@/contexts/AppContext';
import { PurchaseProvider } from '@/contexts/PurchaseContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { BTCPayMetadata, BTCPayContextType } from '@/contexts/BTCPayContext';
import type { AppContextType } from '@/contexts/AppContext';
import type { PurchaseContextType } from '@/contexts/PurchaseContext';
import type { Package, BTCPayInvoice } from '@/types';

type CreateInvoiceParams = {
  price: number;
  currency: string;
  orderId: string;
  metadata: BTCPayMetadata;
};

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
  connectWallet: vi.fn(),
  sendTransaction: vi.fn(),
  isConnecting: false,
  disconnect: vi.fn(),
};

export const mockBTCPayProvider: BTCPayContextType = {
  createInvoice: vi.fn().mockImplementation(async (params: CreateInvoiceParams) => ({} as BTCPayInvoice)),
  checkInvoiceStatus: vi.fn().mockImplementation(async (invoiceId: string) => ({} as BTCPayInvoice)),
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

const defaultBTCPayInvoice: BTCPayInvoice = {
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
  measureAsyncOperation: vi.fn((name, operation) => operation()),
  measureSyncOperation: vi.fn((name, operation) => operation()),
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

export const mockBTCPayContext: BTCPayContextType = {
  createInvoice: vi.fn().mockResolvedValue({
    id: 'mock-id',
    checkoutLink: 'mock-link',
    status: 'New',
    amount: '0.001',
    currency: 'BTC',
    metadata: { packageId: 1, coins: 1000 },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  }),
  checkInvoiceStatus: vi.fn().mockResolvedValue({
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

export const mockAppContext: AppContextType = {
  error: null,
  setError: vi.fn(),
  clearError: vi.fn(),
};

export const mockPurchaseContext: PurchaseContextType = {
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

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Partial<{
    web3: {
      account: string | null;
      chainId: number | null;
      isConnecting: boolean;
    };
    app: {
      error: Error | null;
    };
    purchase: {
      selectedPackage: Package | null;
      paymentMethod: 'eth' | 'btc';
      isProcessing: boolean;
      activeInvoiceId: string | null;
    };
  }>;
}

const AllTheProviders: React.FC<{ children: React.ReactNode; initialState?: CustomRenderOptions['initialState'] }> = ({
  children,
  initialState = {},
}) => {
  return (
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
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialState, ...renderOptions } = options;
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} initialState={initialState} />,
    ...renderOptions,
  });
};

/**
 * Custom renderer that wraps the UI with all necessary providers
 */
const AllProviders = ({ children, state = {} }: ProvidersProps) => {
  // Create context values based on initial state
  const web3Value = {
    account: state.web3?.account ?? null,
    chainId: state.web3?.chainId ?? null,
    isConnecting: state.web3?.isConnecting ?? false,
    connectWallet: async () => {},
    disconnectWallet: async () => {},
    sendTransaction: async () => ({ success: false })
  };

  const appValue = {
    error: state.app?.error ?? null,
    setError: () => {},
    clearError: () => {}
  };

  const purchaseValue = {
    selectedPackage: state.purchase?.selectedPackage ?? null,
    paymentMethod: state.purchase?.paymentMethod ?? 'eth',
    isProcessing: state.purchase?.isProcessing ?? false,
    activeInvoiceId: state.purchase?.activeInvoiceId ?? null,
    setSelectedPackage: () => {},
    setPaymentMethod: () => {},
    setIsProcessing: () => {},
    setActiveInvoiceId: () => {},
    resetPurchaseState: () => {}
  };

  const btcPayValue = {
    createInvoice: async () => defaultBTCPayInvoice,
    checkInvoiceStatus: async () => defaultBTCPayInvoice,
    currentInvoice: null,
    isLoading: false
  };

  return (
    <ErrorBoundary>
      <AppProvider value={appValue}>
        <Web3Provider value={web3Value}>
          <BTCPayProvider value={btcPayValue}>
            <PurchaseProvider value={purchaseValue}>
              {children}
            </PurchaseProvider>
          </BTCPayProvider>
        </Web3Provider>
      </AppProvider>
    </ErrorBoundary>
  );
};

/**
 * Custom render method that includes all providers
 */
const customRender = (
  ui: React.ReactElement,
  {
    state,
    ...renderOptions
  }: Partial<ProvidersProps> & Omit<RenderOptions, 'wrapper'> = {}
) => {
  return render(ui, {
    wrapper: (props) => (
      <AllProviders {...props} state={state} />
    ),
    ...renderOptions
  });
};

/**
 * Basic test wrapper with error boundary
 */
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
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

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render }; 