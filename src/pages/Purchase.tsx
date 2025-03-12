import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PurchaseCard } from '@/components/purchase/PurchaseCard';
import { packages } from '@/components/purchase/packages.data';
import { useBTCPay } from '@/contexts/btcpay/hook';
import { type Package } from '@/types/package';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Purchase() {
  const navigate = useNavigate();
  const { createInvoice, isLoading } = useBTCPay();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setConfirmDialogOpen(true);
  };

  const handlePurchaseConfirm = async () => {
    if (!selectedPackage) return;
    
    try {
      // Example implementation - adjust based on your actual API
      const invoice = await createInvoice({
        price: selectedPackage.btcPrice,
        currency: 'BTC',
        orderId: `order-${Date.now()}`,
        metadata: {
          packageId: parseInt(selectedPackage.id),
          coins: selectedPackage.coins,
          intentId: `intent-${Date.now()}`
        }
      });
      
      // Navigate to success page with invoice ID
      navigate(`/purchase/success?invoiceId=${invoice.id}`);
    } catch (error) {
      console.error('Purchase failed:', error);
      // Handle error - display message, etc.
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Purchase Coins</h1>
        <p className="text-muted-foreground mt-2">
          Select a package that fits your needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PurchaseCard
            key={pkg.id}
            package={pkg}
            onSelect={() => handlePackageSelect(pkg)}
          />
        ))}
      </div>
      
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              {selectedPackage && (
                <div className="mt-2">
                  <p>You are about to purchase:</p>
                  <p className="font-medium mt-2">{selectedPackage.name}</p>
                  <p className="mt-1">{selectedPackage.coins.toLocaleString()} coins for {selectedPackage.btcPrice} BTC</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePurchaseConfirm} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 