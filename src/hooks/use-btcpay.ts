import { useState, useCallback } from 'react';
import { btcPayService } from '@/lib/btcpay';
import { BTCPayInvoice, BTCPayInvoiceRequest } from '@/types/btcpay';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import { useBTCPay } from '@/contexts/btcpay';
import { Package } from '@/types/package';

export const useBTCPay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<BTCPayInvoice | null>(null);
  const { user } = useAuth();

  const createInvoice = async (params: Omit<BTCPayInvoiceRequest, 'redirectURL'>) => {
    if (!user) {
      toast.error('Please sign in to make a purchase');
      return null;
    }

    setIsLoading(true);
    try {
      const invoice = await btcPayService.createInvoice({
        ...params,
        redirectURL: `${window.location.origin}/purchase/success`,
      });
      
      setCurrentInvoice(invoice);
      return invoice;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create payment invoice. Please try again.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const checkInvoiceStatus = async (invoiceId: string) => {
    try {
      const invoice = await btcPayService.getInvoice(invoiceId);
      setCurrentInvoice(invoice);
      return invoice;
    } catch (error) {
      console.error('Failed to check invoice status:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to check payment status');
      }
      return null;
    }
  };

  const resetInvoice = () => {
    setCurrentInvoice(null);
  };

  return {
    isLoading,
    currentInvoice,
    createInvoice,
    checkInvoiceStatus,
    resetInvoice,
  };
};

export function useBTCPayCheckout() {
  const btcPay = useBTCPay();

  const createInvoice = useCallback(async (pkg: Package): Promise<BTCPayInvoice> => {
    if (!btcPay) {
      throw new Error('BTCPay context not found');
    }

    return btcPay.createInvoice(pkg);
  }, [btcPay]);

  const getInvoiceStatus = useCallback(async (invoiceId: string) => {
    if (!btcPay) {
      throw new Error('BTCPay context not found');
    }

    return btcPay.getInvoiceStatus(invoiceId);
  }, [btcPay]);

  return {
    createInvoice,
    getInvoiceStatus
  };
} 