import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Package } from '@/components/purchase/packages.data';

interface PurchaseState {
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

interface Web3State {
  account: string | null;
  chainId: number | null;
  isConnecting: boolean;
  setAccount: (account: string | null) => void;
  setChainId: (chainId: number | null) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  resetWeb3State: () => void;
}

interface AppState {
  isLoading: boolean;
  error: Error | null;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set) => ({
      selectedPackage: null,
      paymentMethod: 'eth',
      isProcessing: false,
      activeInvoiceId: null,
      setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      setActiveInvoiceId: (id) => set({ activeInvoiceId: id }),
      resetPurchaseState: () =>
        set({
          selectedPackage: null,
          paymentMethod: 'eth',
          isProcessing: false,
          activeInvoiceId: null,
        }),
    }),
    {
      name: 'purchase-storage',
    }
  )
);

export const useWeb3Store = create<Web3State>()(
  persist(
    (set) => ({
      account: null,
      chainId: null,
      isConnecting: false,
      setAccount: (account) => set({ account }),
      setChainId: (chainId) => set({ chainId }),
      setIsConnecting: (isConnecting) => set({ isConnecting }),
      resetWeb3State: () =>
        set({
          account: null,
          chainId: null,
          isConnecting: false,
        }),
    }),
    {
      name: 'web3-storage',
    }
  )
);

export const useAppStore = create<AppState>()((set) => ({
  isLoading: false,
  error: null,
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 