import React, { createContext, useContext, useCallback, useState } from 'react';
import { BTCPayService } from '@/lib/btcpay';
import type { 
  BTCPayInvoice, 
  BTCPayInvoiceRequest,
  InvoiceStatus,
  BTCPayPaymentMethod
} from '@/types/btcpay';
import { Package } from '@/types/package';

export interface BTCPayContextType {
  createInvoice: (amount: number, currency: string) => Promise<BTCPayInvoice>;
  getInvoice: (invoiceId: string) => Promise<BTCPayInvoice>;
  btcPayService: BTCPayService;
}

export const BTCPayContext = createContext<BTCPayContextType | null>(null);

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
    error,
    btcPayService
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