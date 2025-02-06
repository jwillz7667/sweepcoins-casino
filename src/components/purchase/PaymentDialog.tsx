import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { QRCode } from "@/components/ui/qr-code";
import { Package } from './packages.data';
import { BTCPayInvoice } from '@/types/btcpay';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: Package | null;
  onPaymentMethodChange: (method: 'eth' | 'btc') => void;
  isProcessing: boolean;
  isLoading: boolean;
  currentInvoice: BTCPayInvoice | null;
  onETHPurchase: () => Promise<{ success: boolean; error?: Error }>;
  onBTCPurchase: () => Promise<{ success: boolean; error?: Error }>;
}

export function PaymentDialog({
  isOpen,
  onClose,
  selectedPackage,
  onPaymentMethodChange,
  isProcessing,
  isLoading,
  currentInvoice,
  onETHPurchase,
  onBTCPurchase,
}: PaymentDialogProps) {
  if (!selectedPackage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase {selectedPackage.coins.toLocaleString()} Coins</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="eth" onValueChange={onPaymentMethodChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="eth">ETH</TabsTrigger>
            <TabsTrigger value="btc">BTC</TabsTrigger>
          </TabsList>
          <TabsContent value="eth">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Price:</span>
                <span>{selectedPackage.price} ETH</span>
              </div>
              <Button
                onClick={onETHPurchase}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Buy with ETH"}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="btc">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Price:</span>
                <span>{selectedPackage.btcPrice} BTC</span>
              </div>
              {currentInvoice ? (
                <div className="space-y-4">
                  <QRCode value={currentInvoice.checkoutLink} size={256} />
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 