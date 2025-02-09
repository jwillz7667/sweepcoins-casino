import React, { createContext, useContext, useCallback, useState } from 'react';
import { BTCPayService } from '@/lib/btcpay';
import type { 
  BTCPayInvoice, 
  BTCPayInvoiceRequest,
  InvoiceStatus,
  BTCPayPaymentMethod
} from '@/types/btcpay';
import { Package } from '@/types/package';

interface BTCPayContextType {
  createInvoice: (pkg: Package) => Promise<BTCPayInvoice>;
  getInvoiceStatus: (invoiceId: string) => Promise<InvoiceStatus>;
  getPaymentMethods: (invoiceId: string) => Promise<BTCPayPaymentMethod[]>;
  subscribeToInvoiceStatus: (
    invoiceId: string,
    callback: (status: InvoiceStatus) => void
  ) => () => void;
  isLoading: boolean;
  error: Error | null;
}

const BTCPayContext = createContext<BTCPayContextType | undefined>(undefined);

export function BTCPayProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const btcPayService = new BTCPayService();

  const createInvoice = useCallback(async (pkg: Package) => {
    setIsLoading(true);
    setError(null);
    try {
      const invoice = await btcPayService.createInvoice({
        price: pkg.btcPrice,
        currency: 'BTC',
        metadata: {
          packageId: pkg.id,
          coins: pkg.coins
        }
      });
      return invoice;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create invoice'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getInvoiceStatus = useCallback(async (invoiceId: string) => {
    try {
      const invoice = await btcPayService.getInvoice(invoiceId);
      return invoice.status;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get invoice status'));
      throw err;
    }
  }, []);

  const getPaymentMethods = useCallback(async (invoiceId: string) => {
    try {
      return await btcPayService.getInvoicePaymentMethods(invoiceId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get payment methods'));
      throw err;
    }
  }, []);

  const subscribeToInvoiceStatus = useCallback(
    (invoiceId: string, callback: (status: InvoiceStatus) => void) => {
      return btcPayService.subscribeToInvoiceStatus(invoiceId, callback);
    },
    []
  );

  const value = {
    createInvoice,
    getInvoiceStatus,
    getPaymentMethods,
    subscribeToInvoiceStatus,
    isLoading,
    error
  };

  return (
    <BTCPayContext.Provider value={value}>
      {children}
    </BTCPayContext.Provider>
  );
}

export function useBTCPay() {
  const context = useContext(BTCPayContext);
  if (context === undefined) {
    throw new Error('useBTCPay must be used within a BTCPayProvider');
  }
  return context;
} 