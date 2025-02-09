import { memo, useState } from 'react';
import { toast } from "sonner";
import { useApi } from '@/hooks/use-api';
import { packages } from './packages.data';
import { PaymentDialog } from './PaymentDialog';
import { PurchaseCard } from './PurchaseCard';
import { usePerformance } from '@/hooks/use-performance';
import { errorTracking } from '@/lib/error-tracking';
import { Package } from '@/types/package';
import { PurchaseIntent } from '@/types';

export const PurchaseOptions = memo(() => {
  const api = useApi();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize performance monitoring
  const performance = usePerformance({
    componentName: 'PurchaseOptions',
    tags: {
      hasSelectedPackage: String(!!selectedPackage),
    },
  });

  const handlePaymentSuccess = async () => {
    const traceId = performance.startInteraction('payment_success', {
      packageId: selectedPackage?.id || '',
    });

    try {
      toast.success(`Successfully purchased ${selectedPackage?.coins.toLocaleString()} coins!`);
      // Additional success handling (e.g., update user balance)
      performance.recordInteraction('payment_success_handled');
    } catch (error) {
      console.error('Error handling payment success:', error);
      errorTracking.captureError(error, {
        context: {
          component: 'PurchaseOptions',
          action: 'handle_payment_success',
          packageId: selectedPackage?.id || '',
        }
      });
    } finally {
      setIsDialogOpen(false);
      setSelectedPackage(null);
      performance.endInteraction(traceId);
    }
  };

  const handlePaymentError = (error: Error) => {
    const traceId = performance.startInteraction('payment_error', {
      packageId: selectedPackage?.id || '',
      error: error.message,
    });

    console.error('Payment error:', error);
    errorTracking.captureError(error, {
      context: {
        component: 'PurchaseOptions',
        action: 'handle_payment_error',
        packageId: selectedPackage?.id || '',
      }
    });

    toast.error(error.message || 'Payment failed. Please try again.');
    setIsDialogOpen(false);
    setSelectedPackage(null);
    performance.endInteraction(traceId);
  };

  const handlePackageSelect = async (pkg: Package) => {
    const traceId = performance.startInteraction('select_package', {
      packageId: pkg.id,
    });

    try {
      // Create purchase intent
      const intent = await performance.measureOperation(
        'create_purchase_intent',
        () =>
          api.post<PurchaseIntent>('/api/purchase/intent', {
            packageId: pkg.id,
            amount: pkg.btcPrice,
            currency: 'BTC',
          })
      );

      if (!intent || !intent.id) {
        throw new Error('Failed to create purchase intent');
      }

      setSelectedPackage(pkg);
      setIsDialogOpen(true);
      performance.recordInteraction('package_selected');
    } catch (error) {
      console.error('Error selecting package:', error);
      errorTracking.captureError(error, {
        context: {
          component: 'PurchaseOptions',
          action: 'select_package',
          packageId: pkg.id,
        }
      });
      toast.error('Failed to initialize purchase. Please try again.');
    } finally {
      performance.endInteraction(traceId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PurchaseCard
            key={pkg.id}
            package={pkg}
            onSelect={() => handlePackageSelect(pkg)}
          />
        ))}
      </div>
      
      {selectedPackage && (
        <PaymentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          selectedPackage={selectedPackage}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </div>
  );
});