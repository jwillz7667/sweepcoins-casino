'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { type Package } from '@/types/package';
import { type BTCPayInvoice } from '@/types/btcpay';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: Package | null;
  onPaymentMethodChange: (method: 'eth' | 'btc') => void;
  onETHPurchase: () => Promise<{ success: boolean; error?: Error }>;
  onBTCPurchase: () => Promise<{ success: boolean; error?: Error }>;
  isProcessing: boolean;
  isLoading: boolean;
  currentInvoice: BTCPayInvoice | null;
}

export function PaymentDialog({
  isOpen,
  onClose,
  selectedPackage,
  onPaymentMethodChange,
  onETHPurchase,
  onBTCPurchase,
  isProcessing,
  isLoading,
  currentInvoice
}: PaymentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Purchase</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="eth" onValueChange={(value) => onPaymentMethodChange(value as 'eth' | 'btc')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="eth">Ethereum</TabsTrigger>
            <TabsTrigger value="btc">Bitcoin</TabsTrigger>
          </TabsList>

          <TabsContent value="eth">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Price:</span>
                  <span>{selectedPackage?.price} ETH</span>
                </div>
                <Button
                  onClick={onETHPurchase}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Buy with ETH"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="btc">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Price:</span>
                  <span>{selectedPackage?.btcPrice} BTC</span>
                </div>
                {currentInvoice ? (
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500">QR Code</span>
                    </div>
                    <Button
                      onClick={() => window.open(currentInvoice.checkoutLink, '_blank')}
                      className="w-full"
                    >
                      Open in Wallet
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={onBTCPurchase}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Creating Invoice..." : "Pay with BTC"}
                  </Button>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 