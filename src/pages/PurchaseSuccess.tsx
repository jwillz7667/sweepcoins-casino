import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useBTCPay } from '@/hooks/use-btcpay';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function PurchaseSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();
  const { getInvoiceStatus } = useBTCPay();

  const invoiceId = searchParams.get('invoiceId');

  useEffect(() => {
    if (!invoiceId) {
      navigate('/purchase');
      return;
    }

    const verifyPayment = async () => {
      try {
        const status = await getInvoiceStatus(invoiceId);
        
        if (status === 'Settled') {
          await refreshUser();
          toast.success('Payment confirmed! Your coins have been credited.');
        } else if (status === 'Invalid' || status === 'Expired') {
          toast.error('Payment verification failed. Please try again.');
          navigate('/purchase');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast.error('Failed to verify payment. Please contact support.');
        navigate('/purchase');
      }
    };

    verifyPayment();
  }, [invoiceId, navigate, getInvoiceStatus, refreshUser]);

  if (!invoiceId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            {user ? (
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
            ) : (
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {user ? 'Purchase Successful!' : 'Verifying Payment...'}
            </h1>
            <p className="text-muted-foreground">
              {user
                ? `Your account has been credited with the purchased coins.`
                : 'Please wait while we verify your payment.'}
            </p>
          </div>

          {user && (
            <div className="pt-4 space-y-4 w-full">
              <div className="flex justify-between px-4 py-2 bg-muted rounded-lg">
                <span className="text-muted-foreground">Current Balance</span>
                <span className="font-medium">{user.sweepcoins.toLocaleString()} GC</span>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={() => navigate('/games')}>
                  Start Playing
                </Button>
                <Button variant="outline" onClick={() => navigate('/purchase')}>
                  Purchase More Coins
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 