import { useState, useEffect, useCallback } from 'react';
import { useBTCPay } from '@/contexts/btcpay/context';
import type { BTCPayInvoice, InvoiceStatus, BTCPayPaymentMethod } from '@/types/btcpay';
import type { Package } from '@/types/package';

interface UseInvoiceOptions {
  onStatusChange?: (status: InvoiceStatus) => void;
  onSettled?: (invoice: BTCPayInvoice) => void;
  onExpired?: (invoice: BTCPayInvoice) => void;
}

export function useInvoice(options: UseInvoiceOptions = {}) {
  const [invoice, setInvoice] = useState<BTCPayInvoice | null>(null);
  const [status, setStatus] = useState<InvoiceStatus | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<BTCPayPaymentMethod[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  const { 
    createInvoice, 
    getInvoiceStatus, 
    getPaymentMethods,
    subscribeToInvoiceStatus,
    isLoading 
  } = useBTCPay();

  const handleStatusChange = useCallback((newStatus: InvoiceStatus) => {
    setStatus(newStatus);
    options.onStatusChange?.(newStatus);

    if (invoice) {
      if (newStatus === 'Settled') {
        options.onSettled?.(invoice);
      } else if (newStatus === 'Expired') {
        options.onExpired?.(invoice);
      }
    }
  }, [invoice, options]);

  const create = useCallback(async (pkg: Package) => {
    try {
      const newInvoice = await createInvoice(pkg);
      setInvoice(newInvoice);
      setStatus(newInvoice.status);
      
      // Get available payment methods
      const methods = await getPaymentMethods(newInvoice.id);
      setPaymentMethods(methods);
      
      return newInvoice;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create invoice'));
      throw err;
    }
  }, [createInvoice, getPaymentMethods]);

  const refresh = useCallback(async () => {
    if (!invoice) return;
    
    try {
      const currentStatus = await getInvoiceStatus(invoice.id);
      handleStatusChange(currentStatus);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh invoice status'));
    }
  }, [invoice, getInvoiceStatus, handleStatusChange]);

  useEffect(() => {
    if (!invoice) return;

    const unsubscribe = subscribeToInvoiceStatus(invoice.id, handleStatusChange);
    return () => unsubscribe();
  }, [invoice, subscribeToInvoiceStatus, handleStatusChange]);

  return {
    invoice,
    status,
    paymentMethods,
    error,
    isLoading,
    create,
    refresh
  };
} 