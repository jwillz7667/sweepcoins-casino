'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useInvoice } from '@/hooks/use-invoice';
import { Package } from '@/types/package';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BTCPayPaymentMethod } from '@/types/btcpay';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: Package;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: Error) => void;
}

export function PaymentDialog({
  isOpen,
  onClose,
  selectedPackage,
  onPaymentSuccess,
  onPaymentError
}: PaymentDialogProps) {
  const { 
    invoice, 
    status, 
    paymentMethods,
    error,
    isLoading,
    create 
  } = useInvoice({
    onSettled: () => {
      onPaymentSuccess?.();
      setTimeout(onClose, 2000); // Close after showing success state
    },
    onExpired: () => {
      onPaymentError?.(new Error('Payment expired'));
    }
  });

  React.useEffect(() => {
    if (isOpen && selectedPackage && !invoice) {
      create(selectedPackage).catch(onPaymentError);
    }
  }, [isOpen, selectedPackage, invoice, create, onPaymentError]);

  const getStatusDisplay = () => {
    if (isLoading) return 'Generating payment details...';
    if (error) return 'Error creating payment';
    if (!invoice) return 'Initializing...';

    switch (status) {
      case 'New':
        return 'Waiting for payment...';
      case 'Processing':
        return 'Processing payment...';
      case 'Settled':
        return 'Payment successful!';
      case 'Expired':
        return 'Payment expired';
      case 'Invalid':
        return 'Payment invalid';
      default:
        return 'Unknown status';
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;
    if (status === 'Settled') return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    if (status === 'Expired' || status === 'Invalid') {
      return <XCircle className="h-6 w-6 text-red-500" />;
    }
    return null;
  };

  const bitcoinPaymentMethod = paymentMethods?.find(
    (m: BTCPayPaymentMethod) => m.cryptoCode === 'BTC'
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          {getStatusIcon()}
          
          <p className="text-center text-sm text-muted-foreground">
            {getStatusDisplay()}
          </p>

          {invoice && bitcoinPaymentMethod && (
            <div className="flex flex-col items-center space-y-2">
              <QRCodeSVG
                value={bitcoinPaymentMethod.paymentLink}
                size={200}
                includeMargin
                className="bg-white p-2 rounded-lg"
              />
              
              <p className="text-xs text-center text-muted-foreground">
                Scan QR code or click below to pay
              </p>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(bitcoinPaymentMethod.paymentLink, '_blank')}
                disabled={status === 'Settled' || status === 'Expired'}
              >
                Open in Wallet
              </Button>

              <div className="text-center space-y-1">
                <p className="text-sm font-medium">Amount Due</p>
                <p className="text-lg font-bold">
                  {invoice.amount} {invoice.currency}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 text-sm">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className={cn(
              "px-4",
              status === 'Settled' && "hidden"
            )}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 