import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { PurchaseOptions } from './PurchaseOptions';
import { renderWithProviders, mockPackage, mockBTCPayInvoice, mockToast, createMockApi } from '@/test/utils';
import { errorTracking } from '@/lib/error-tracking';
import { performanceMonitor } from '@/lib/performance';
import { usePurchaseStore } from '@/store';
import { mockBTCPayContext } from '@/test/utils';
import { useApi } from '@/hooks/use-api';
import { useBTCPay } from '@/hooks/use-btcpay';

// Mock dependencies
vi.mock('@/lib/error-tracking', () => ({
  errorTracking: {
    captureError: vi.fn(),
  },
}));

vi.mock('@/lib/performance', () => ({
  performanceMonitor: {
    startTrace: vi.fn(() => 'test-trace-id'),
    endTrace: vi.fn(),
    recordMetric: vi.fn(),
    measureAsyncOperation: vi.fn((name, operation) => operation()),
    measureSyncOperation: vi.fn((name, operation) => operation()),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('@/hooks/use-web3', () => ({
  useWeb3: () => ({
    account: '0x123',
    chainId: 1,
    connectWallet: vi.fn(),
    sendTransaction: vi.fn().mockResolvedValue({ success: true, hash: 'test-hash' }),
  }),
}));

vi.mock('@/hooks/use-btcpay', () => ({
  useBTCPay: () => ({
    createInvoice: vi.fn().mockResolvedValue(mockBTCPayInvoice),
    checkInvoiceStatus: vi.fn().mockResolvedValue({ status: 'New' }),
    currentInvoice: null,
    isLoading: false,
  }),
}));

vi.mock('@/hooks/use-api', () => ({
  useApi: vi.fn(),
}));

vi.mock('@/hooks/use-btcpay', () => ({
  useBTCPay: vi.fn(),
}));

describe('PurchaseOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePurchaseStore.setState({
      selectedPackage: null,
      paymentMethod: 'eth',
      isProcessing: false,
      activeInvoiceId: null,
    });
    (useApi as any).mockReturnValue({
      post: vi.fn().mockResolvedValue({ id: 'test-intent' }),
    });
    (useBTCPay as any).mockReturnValue(mockBTCPayContext);
  });

  it('renders package cards correctly', () => {
    renderWithProviders(<PurchaseOptions />);
    
    // Check if package cards are rendered
    expect(screen.getByText(mockPackage.coins.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(`${mockPackage.price} ETH`)).toBeInTheDocument();
  });

  it('opens payment dialog when package is selected', async () => {
    renderWithProviders(<PurchaseOptions />);
    
    // Click purchase button
    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseButton);

    // Check if dialog is opened
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('handles ETH purchase flow successfully', async () => {
    const mockApi = createMockApi();
    mockApi.post.mockResolvedValueOnce({ id: 'test-intent' });
    vi.mocked(useApi).mockReturnValue(mockApi);

    renderWithProviders(<PurchaseOptions />);
    
    // Select package and open dialog
    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseButton);

    // Click ETH purchase button
    const ethButton = await screen.findByRole('button', { name: /buy with eth/i });
    fireEvent.click(ethButton);

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/api/purchase/intent', expect.any(Object));
      expect(mockToast.success).toHaveBeenCalledWith('Purchase successful!');
    });
  });

  it('handles ETH purchase errors correctly', async () => {
    const mockApi = createMockApi();
    mockApi.post.mockRejectedValueOnce(new Error('API Error'));
    vi.mocked(useApi).mockReturnValue(mockApi);

    renderWithProviders(<PurchaseOptions />);
    
    // Select package and open dialog
    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseButton);

    // Click ETH purchase button
    const ethButton = await screen.findByRole('button', { name: /buy with eth/i });
    fireEvent.click(ethButton);

    await waitFor(() => {
      expect(errorTracking.captureError).toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalled();
    });
  });

  it('handles BTC purchase flow successfully', async () => {
    const mockApi = createMockApi();
    mockApi.post.mockResolvedValueOnce({ id: 'test-intent' });
    vi.mocked(useApi).mockReturnValue(mockApi);

    renderWithProviders(<PurchaseOptions />);
    
    // Select package and open dialog
    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseButton);

    // Switch to BTC tab
    const btcTab = screen.getByRole('tab', { name: /btc/i });
    fireEvent.click(btcTab);

    // Click BTC purchase button
    const btcButton = await screen.findByRole('button', { name: /pay with btc/i });
    fireEvent.click(btcButton);

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/api/purchase/intent', expect.any(Object));
      expect(screen.getByRole('img', { name: /qr code/i })).toBeInTheDocument();
    });
  });

  it('handles BTC invoice polling correctly', async () => {
    const mockApi = createMockApi();
    mockApi.post.mockResolvedValueOnce({ id: 'test-intent' });
    const mockCheckStatus = vi.fn()
      .mockResolvedValueOnce({ status: 'New' })
      .mockResolvedValueOnce({ status: 'Processing' })
      .mockResolvedValueOnce({ status: 'Settled' });
    
    vi.mocked(useApi).mockReturnValue(mockApi);
    vi.mocked(useBTCPay).mockReturnValue({
      ...vi.mocked(useBTCPay)(),
      checkInvoiceStatus: mockCheckStatus,
    });

    renderWithProviders(<PurchaseOptions />);
    
    // Select package and initiate BTC purchase
    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseButton);

    const btcTab = screen.getByRole('tab', { name: /btc/i });
    fireEvent.click(btcTab);

    const btcButton = await screen.findByRole('button', { name: /pay with btc/i });
    fireEvent.click(btcButton);

    await waitFor(() => {
      expect(mockCheckStatus).toHaveBeenCalled();
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        expect.stringContaining('btc_payment_success'),
        expect.any(Number),
        expect.any(Object)
      );
    });
  });

  it('tracks performance metrics correctly', async () => {
    renderWithProviders(<PurchaseOptions />);
    
    // Select package
    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseButton);

    expect(performanceMonitor.startTrace).toHaveBeenCalledWith(
      'PurchaseOptions_select_package',
      expect.any(Object)
    );
    expect(performanceMonitor.endTrace).toHaveBeenCalled();
  });

  it('handles dialog close correctly', async () => {
    renderWithProviders(<PurchaseOptions />);
    
    // Open and close dialog
    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    fireEvent.click(purchaseButton);

    const dialog = await screen.findByRole('dialog');
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
      expect(usePurchaseStore.getState().selectedPackage).toBeNull();
    });
  });
}); 