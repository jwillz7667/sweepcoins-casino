import { memo, useEffect, useState } from 'react';
import { toast } from "sonner";
import { useWeb3 } from "@/hooks/use-web3";
import { useBTCPay } from "@/hooks/use-btcpay";
import { useApi } from '@/hooks/use-api';
import { packages } from './packages.data';
import { PaymentDialog } from './PaymentDialog';
import { PackageCard } from './PurchaseCard';
import { usePurchaseStore } from '@/store';
import { useAppStore } from '@/store';
import { usePerformance } from '@/hooks/use-performance';
import { useAsyncCallback } from '@/hooks/use-async';
import { errorTracking } from '@/lib/error-tracking';
import { PurchaseIntent } from '@/types';

export const PurchaseOptions = memo(() => {
  const { account, sendTransaction } = useWeb3();
  const { createInvoice, checkInvoiceStatus, currentInvoice } = useBTCPay();
  const api = useApi();
  
  const {
    selectedPackage,
    paymentMethod,
    isProcessing,
    activeInvoiceId,
    setSelectedPackage,
    setPaymentMethod,
    setIsProcessing,
    setActiveInvoiceId,
    resetPurchaseState
  } = usePurchaseStore();

  const { setError } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize performance monitoring
  const performance = usePerformance({
    componentName: 'PurchaseOptions',
    tags: {
      paymentMethod,
      hasSelectedPackage: String(!!selectedPackage),
      isWalletConnected: String(!!account),
    },
  });

  // Handle ETH purchase with performance tracking and error handling
  const { execute: executeETHPurchase, isLoading: isETHPurchaseLoading } = useAsyncCallback<{ success: boolean; error?: Error }>(
    async () => {
      if (!selectedPackage || !account) {
        return { success: false, error: new Error('No package selected or wallet not connected') };
      }

      const traceId = performance.startInteraction('eth_purchase', {
        packageId: String(selectedPackage.id),
        amount: String(selectedPackage.price),
      });

      try {
        setIsProcessing(true);

        // Create purchase intent first
        const intent = await performance.measureOperation(
          'create_purchase_intent',
          () =>
            api.post<PurchaseIntent>('/api/purchase/intent', {
              packageId: selectedPackage.id,
              amount: selectedPackage.price,
              currency: 'ETH',
            })
        );

        // Process transaction
        const txResult = await performance.measureOperation(
          'send_transaction',
          () => sendTransaction(selectedPackage.price)
        );

        if (!txResult || !txResult.hash) {
          throw new Error('Transaction failed or hash not received');
        }

        // Confirm purchase with backend
        await performance.measureOperation(
          'confirm_purchase',
          () =>
            api.post('/api/purchase/confirm', {
              intentId: intent.id,
              transactionHash: txResult.hash,
            })
        );

        toast.success('Purchase successful!');
        setIsDialogOpen(false);
        resetPurchaseState();

        performance.recordInteraction('eth_purchase_success');
        return { success: true };
      } catch (error) {
        performance.recordInteraction('eth_purchase_error');
        errorTracking.captureError(error, {
          context: {
            component: 'PurchaseOptions',
            action: 'eth_purchase',
            packageId: selectedPackage.id,
            amount: selectedPackage.price,
          }
        });
        return { 
          success: false, 
          error: error instanceof Error ? error : new Error('Purchase failed') 
        };
      } finally {
        setIsProcessing(false);
        performance.endInteraction(traceId);
      }
    },
    {
      onError: (error) => {
        setError(error);
        toast.error(error.message || 'Purchase failed. Please try again.');
      },
    }
  );

  // Handle BTC purchase with performance tracking and error handling
  const { execute: executeBTCPurchase, isLoading: isBTCPurchaseLoading } = useAsyncCallback<{ success: boolean; error?: Error }>(
    async () => {
      if (!selectedPackage) {
        return { success: false, error: new Error('No package selected') };
      }

      const traceId = performance.startInteraction('btc_purchase', {
        packageId: String(selectedPackage.id),
        amount: String(selectedPackage.btcPrice),
      });

      try {
        setIsProcessing(true);

        // Create purchase intent first
        const intent = await performance.measureOperation(
          'create_purchase_intent',
          () =>
            api.post<PurchaseIntent>('/api/purchase/intent', {
              packageId: selectedPackage.id,
              amount: selectedPackage.btcPrice,
              currency: 'BTC',
            })
        );

        if (!intent || !intent.id) {
          throw new Error('Failed to create purchase intent - invalid response');
        }

        // Create BTCPay invoice
        const invoice = await performance.measureOperation(
          'create_btc_invoice',
          async () => {
            const response = await createInvoice({
              price: selectedPackage.btcPrice,
              currency: 'BTC',
              orderId: intent.id,
              metadata: {
                packageId: String(selectedPackage.id),
                coins: selectedPackage.coins,
                intentId: intent.id
              },
            });

            if (!response || !response.id || !response.checkoutLink) {
              throw new Error('Invalid invoice response from BTCPay');
            }

            return response;
          }
        );

        setActiveInvoiceId(invoice.id);
        window.open(invoice.checkoutLink, '_blank');
        performance.recordInteraction('btc_invoice_created');
        return { success: true };
      } catch (error) {
        console.error('BTC purchase error:', error);
        performance.recordInteraction('btc_purchase_error');
        errorTracking.captureError(error, {
          context: {
            component: 'PurchaseOptions',
            action: 'btc_purchase',
            packageId: selectedPackage.id,
            amount: selectedPackage.btcPrice,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
        return { 
          success: false, 
          error: error instanceof Error ? error : new Error('Failed to create invoice') 
        };
      } finally {
        setIsProcessing(false);
        performance.endInteraction(traceId);
      }
    },
    {
      onError: (error) => {
        setError(error);
        toast.error(error.message || 'Failed to create invoice. Please try again.');
        setIsDialogOpen(false);
        resetPurchaseState();
      },
    }
  );

  // Effect for handling BTC payment polling with performance tracking
  useEffect(() => {
    if (!activeInvoiceId || !selectedPackage || !isDialogOpen) {
      return;
    }

    const MAX_POLLING_DURATION = 20 * 60 * 1000; // 20 minutes
    const startTime = Date.now();
    const pollInterval = setInterval(pollInvoiceStatus, 5000);

    async function pollInvoiceStatus() {
      if (!activeInvoiceId || !selectedPackage) return;

      const traceId = performance.startInteraction('check_btc_invoice', {
        invoiceId: activeInvoiceId,
      });

      try {
        // Check if we've exceeded the maximum polling duration
        if (Date.now() - startTime > MAX_POLLING_DURATION) {
          clearInterval(pollInterval);
          toast.error('Payment session timed out. Please try again.');
          setIsDialogOpen(false);
          resetPurchaseState();
          performance.recordInteraction('btc_payment_timeout');
          return;
        }

        const updatedInvoice = await performance.measureOperation(
          'check_invoice_status',
          () => checkInvoiceStatus(activeInvoiceId)
        );

        switch (updatedInvoice?.status) {
          case 'Settled':
            clearInterval(pollInterval);
            toast.success(`Successfully purchased ${selectedPackage.coins.toLocaleString()} coins!`);
            setIsDialogOpen(false);
            resetPurchaseState();
            performance.recordInteraction('btc_payment_success');
            break;
          case 'Expired':
            clearInterval(pollInterval);
            toast.error('Payment expired. Please try again.');
            setIsDialogOpen(false);
            resetPurchaseState();
            performance.recordInteraction('btc_payment_expired');
            break;
          case 'New':
            if (Math.floor((Date.now() - startTime) / 1000) % 30 === 0) {
              toast.info('Waiting for payment...', { id: 'btc-pending' });
              performance.recordInteraction('btc_payment_pending');
            }
            break;
          case 'Processing':
            toast.info('Payment is being processed...', { id: 'btc-processing' });
            performance.recordInteraction('btc_payment_processing');
            break;
          default:
            if (updatedInvoice?.status) {
              console.warn('Unknown invoice status:', updatedInvoice.status);
              performance.recordInteraction('btc_payment_unknown_status', 0, {
                status: updatedInvoice.status,
              });
            }
        }
      } catch (error) {
        errorTracking.captureError(error, {
          context: {
            component: 'PurchaseOptions',
            action: 'check_btc_invoice',
            invoiceId: activeInvoiceId,
          }
        });
      } finally {
        performance.endInteraction(traceId);
      }
    }

    return () => {
      clearInterval(pollInterval);
      resetPurchaseState();
    };
  }, [activeInvoiceId, selectedPackage, isDialogOpen, checkInvoiceStatus, performance, resetPurchaseState]);

  // Effect to reset state when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      resetPurchaseState();
    }
  }, [isDialogOpen, resetPurchaseState]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Purchase Game Coins</h1>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
          </span>
          <span className="text-lg font-semibold">Current Balance: {0} GC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            onSelect={() => {
              const traceId = performance.startInteraction('select_package', {
                packageId: String(pkg.id),
              });
              setSelectedPackage(pkg);
              setIsDialogOpen(true);
              performance.endInteraction(traceId);
            }}
          />
        ))}
      </div>
      
      <PaymentDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          resetPurchaseState();
        }}
        selectedPackage={selectedPackage}
        onPaymentMethodChange={setPaymentMethod}
        onETHPurchase={executeETHPurchase}
        onBTCPurchase={executeBTCPurchase}
        isProcessing={isProcessing}
        isLoading={isETHPurchaseLoading || isBTCPurchaseLoading}
        currentInvoice={currentInvoice}
      />
    </div>
  );
});