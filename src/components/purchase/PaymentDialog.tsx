'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { type Package } from '@/types/package';
import { type BTCPayInvoice, type InvoiceStatus } from '@/types/btcpay';
import { QRCode } from '@/components/ui/qr-code';
import { useCallback, useState, useEffect, useRef } from 'react';
import { btcPayService } from '@/lib/btcpay';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, XCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: Package | null;
  onBTCPurchase: () => Promise<{ success: boolean; error?: Error }>;
  isProcessing: boolean;
  isLoading: boolean;
  currentInvoice: BTCPayInvoice | null;
  onPaymentComplete?: () => void;
}

const STATUS_MESSAGES: Record<InvoiceStatus, { 
  message: string; 
  progress: number;
  icon: React.ComponentType;
  color: string;
}> = {
  'New': { 
    message: 'Waiting for payment...', 
    progress: 0,
    icon: Clock,
    color: 'text-blue-500'
  },
  'Processing': { 
    message: 'Processing payment...', 
    progress: 50,
    icon: RefreshCw,
    color: 'text-yellow-500'
  },
  'Settled': { 
    message: 'Payment complete!', 
    progress: 100,
    icon: CheckCircle2,
    color: 'text-green-500'
  },
  'Invalid': { 
    message: 'Payment invalid. Please try again.', 
    progress: 0,
    icon: XCircle,
    color: 'text-red-500'
  },
  'Expired': { 
    message: 'Payment expired. Please try again.', 
    progress: 0,
    icon: AlertCircle,
    color: 'text-orange-500'
  }
};

const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

export function PaymentDialog({
  isOpen,
  onClose,
  selectedPackage,
  onBTCPurchase,
  isProcessing,
  isLoading,
  currentInvoice,
  onPaymentComplete
}: PaymentDialogProps) {
  const [lastClickTime, setLastClickTime] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<InvoiceStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const DEBOUNCE_TIME = 2000;

  // Handle payment status updates
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (currentInvoice?.id) {
      setPaymentStatus(currentInvoice.status);
      unsubscribe = btcPayService.subscribeToInvoiceStatus(currentInvoice.id, (status) => {
        setPaymentStatus(status);
        if (status === 'Settled' && onPaymentComplete) {
          onPaymentComplete();
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentInvoice?.id, onPaymentComplete]);

  // Handle expiration timer
  useEffect(() => {
    if (currentInvoice?.expiresAt) {
      const updateTimer = () => {
        const expirationTime = new Date(currentInvoice.expiresAt).getTime();
        const now = Date.now();
        const remaining = Math.max(0, expirationTime - now);
        
        setTimeRemaining(remaining);

        if (remaining === 0) {
          setPaymentStatus('Expired');
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [currentInvoice?.expiresAt]);

  const handlePurchaseClick = useCallback(async () => {
    const now = Date.now();
    if (now - lastClickTime < DEBOUNCE_TIME) {
      return;
    }
    
    setLastClickTime(now);
    setError(null);
    setIsRetrying(true);

    try {
      const result = await onBTCPurchase();
      if (!result.success && result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
    } finally {
      setIsRetrying(false);
    }
  }, [lastClickTime, onBTCPurchase]);

  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const statusInfo = paymentStatus ? STATUS_MESSAGES[paymentStatus] : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Complete Purchase</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <Card className="overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Price:</span>
                <span className="text-lg font-semibold">{selectedPackage?.btcPrice} BTC</span>
              </div>
              
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {currentInvoice ? (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="relative">
                      <div className="aspect-square bg-white rounded-lg flex items-center justify-center p-4">
                        <QRCode
                          value={currentInvoice.checkoutLink}
                          size={256}
                        />
                      </div>

                      {timeRemaining !== null && timeRemaining > 0 && (
                        <div className="absolute top-2 right-2 bg-black/80 rounded-full px-3 py-1 text-sm font-medium text-white flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {formatTimeRemaining(timeRemaining)}
                        </div>
                      )}
                    </div>

                    {statusInfo && (
                      <motion.div 
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Progress 
                          value={statusInfo.progress} 
                          className="w-full h-2"
                        />
                        <div className="flex items-center justify-center gap-2 text-sm">
                          {StatusIcon && <StatusIcon className={cn("h-5 w-5", statusInfo.color)} />}
                          <p className={cn("font-medium", statusInfo.color)}>
                            {statusInfo.message}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-3">
                      <Button
                        onClick={() => window.open(currentInvoice.checkoutLink, '_blank')}
                        className="w-full"
                        disabled={paymentStatus === 'Settled'}
                        aria-label="Open payment in wallet"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in Wallet
                      </Button>

                      {(paymentStatus === 'Invalid' || paymentStatus === 'Expired') && (
                        <Button
                          onClick={handlePurchaseClick}
                          variant="outline"
                          className="w-full"
                          disabled={isRetrying}
                          aria-label="Try payment again"
                        >
                          {isRetrying ? (
                            <>
                              <Spinner className="mr-2" />
                              Retrying...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Try Again
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    <p className="text-sm text-center text-zinc-400">
                      {paymentStatus === 'Settled' ? 
                        "Thank you for your purchase!" :
                        "Scan the QR code or click the button above to complete your purchase"}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      onClick={handlePurchaseClick}
                      disabled={isLoading || isProcessing || Date.now() - lastClickTime < DEBOUNCE_TIME}
                      className="w-full h-12"
                      aria-label="Create payment"
                    >
                      {isLoading ? (
                        <>
                          <Spinner className="mr-2" />
                          Creating Invoice...
                        </>
                      ) : isProcessing ? (
                        <>
                          <Spinner className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Pay with Bitcoin"
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 