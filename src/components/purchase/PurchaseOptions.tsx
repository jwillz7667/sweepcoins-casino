import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, MessageCircle, GamepadIcon, Wallet, Bitcoin } from "lucide-react";
import { toast } from "sonner";
import { useWeb3 } from "@/hooks/use-web3";
import { useBTCPay } from "@/hooks/use-btcpay";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRCode } from "@/components/ui/qr-code";

const packages = [
  { 
    id: 1, 
    coins: 8000, 
    price: 0.001, // ETH price
    btcPrice: 0.00004, // BTC price
    usdPrice: 1.99,
    freeSC: 0,
    tag: null 
  },
  { 
    id: 2, 
    coins: 20000, 
    price: 0.0025, // ETH price
    btcPrice: 0.0001, // BTC price
    usdPrice: 4.99,
    freeSC: 5,
    tag: null 
  },
  { 
    id: 3, 
    coins: 40000, 
    price: 0.005, // ETH price
    btcPrice: 0.0002, // BTC price
    usdPrice: 9.99,
    freeSC: 10,
    tag: null 
  },
  { 
    id: 4, 
    coins: 80000, 
    price: 0.01, // ETH price
    btcPrice: 0.0004, // BTC price
    usdPrice: 19.99,
    freeSC: 20,
    tag: null 
  },
  { 
    id: 5, 
    coins: 160000, 
    price: 0.0175, // ETH price
    btcPrice: 0.0007, // BTC price
    usdPrice: 34.99,
    freeSC: 40,
    tag: "FLASH OFFER" 
  },
  { 
    id: 6, 
    coins: 180000, 
    price: 0.0195, // ETH price
    btcPrice: 0.00078, // BTC price
    usdPrice: 38.99,
    freeSC: 45,
    tag: "DAILY OFFER" 
  },
  { 
    id: 7, 
    coins: 200000, 
    price: 0.025, // ETH price
    btcPrice: 0.001, // BTC price
    usdPrice: 49.99,
    freeSC: 50,
    tag: null 
  },
];

export const PurchaseOptions = () => {
  const { account, connectWallet, sendTransaction } = useWeb3();
  const { createInvoice, currentInvoice, isLoading: isBTCPayLoading, checkInvoiceStatus } = useBTCPay();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'eth' | 'btc'>('eth');
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Effect for handling BTC payment polling
  useEffect(() => {
    if (!activeInvoiceId || !selectedPackage || !paymentDialogOpen) {
      return;
    }

    const MAX_POLLING_DURATION = 20 * 60 * 1000; // 20 minutes
    startTimeRef.current = Date.now();

    const pollInterval = setInterval(async () => {
      // Check if we've exceeded the maximum polling duration
      if (startTimeRef.current && Date.now() - startTimeRef.current > MAX_POLLING_DURATION) {
        clearInterval(pollInterval);
        toast.error('Payment session timed out. Please try again.');
        setPaymentDialogOpen(false);
        setActiveInvoiceId(null);
        return;
      }

      try {
        const updatedInvoice = await checkInvoiceStatus(activeInvoiceId);
        
        switch (updatedInvoice?.status) {
          case 'Settled':
            clearInterval(pollInterval);
            toast.success(`Successfully purchased ${selectedPackage.coins.toLocaleString()} coins!`);
            setPaymentDialogOpen(false);
            setActiveInvoiceId(null);
            break;
          case 'Expired':
            clearInterval(pollInterval);
            toast.error('Payment expired. Please try again.');
            setPaymentDialogOpen(false);
            setActiveInvoiceId(null);
            break;
          case 'New':
            // Show a pending message only once every 30 seconds to avoid spam
            if (startTimeRef.current && Math.floor((Date.now() - startTimeRef.current) / 1000) % 30 === 0) {
              toast.info('Waiting for payment...', { id: 'btc-pending' });
            }
            break;
          case 'Processing':
            toast.info('Payment is being processed...', { id: 'btc-processing' });
            break;
          default:
            // Handle unknown status
            if (updatedInvoice?.status) {
              console.warn('Unknown invoice status:', updatedInvoice.status);
            }
        }
      } catch (error) {
        console.error('Error checking invoice status:', error);
        // Don't clear the interval on network errors, just skip this iteration
      }
    }, 5000);

    // Cleanup function
    return () => {
      clearInterval(pollInterval);
      setActiveInvoiceId(null);
      startTimeRef.current = null;
    };
  }, [activeInvoiceId, selectedPackage, paymentDialogOpen, checkInvoiceStatus]);

  // Effect to reset active invoice when dialog closes
  useEffect(() => {
    if (!paymentDialogOpen) {
      setActiveInvoiceId(null);
      startTimeRef.current = null;
    }
  }, [paymentDialogOpen]);

  const handlePurchase = async (packageOption: typeof packages[0]) => {
    setSelectedPackage(packageOption);
    setPaymentMethod('eth');
    setPaymentDialogOpen(true);
  };

  const handleETHPurchase = async () => {
    if (!selectedPackage) return;

    if (!account) {
      await connectWallet();
      return;
    }

    setIsProcessing(true);
    try {
      const success = await sendTransaction(selectedPackage.price);
      if (success) {
        toast.success(`Successfully purchased ${selectedPackage.coins.toLocaleString()} coins!`);
        setPaymentDialogOpen(false);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBTCPurchase = async () => {
    if (!selectedPackage) return;

    const invoice = await createInvoice({
      price: selectedPackage.btcPrice,
      currency: 'BTC',
      orderId: `${selectedPackage.id}-${Date.now()}`,
      metadata: {
        packageId: selectedPackage.id,
        coins: selectedPackage.coins,
      },
    });

    if (invoice) {
      window.open(invoice.checkoutLink, '_blank');
      setActiveInvoiceId(invoice.id);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className="relative flex items-center justify-between p-4 bg-[#222222] border-white/5"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Coins className="h-8 w-8 text-yellow-400" />
                <Coins className="h-8 w-8 text-yellow-400 absolute -top-1 -left-1 animate-pulse" />
              </div>
              <span className="text-xl font-semibold">
                GC {pkg.coins.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between flex-1 pl-4 md:pl-8 mt-4 md:mt-0">
              {pkg.tag && (
                <span className="absolute -top-3 left-4 bg-[#00FF47] text-black px-3 py-0.5 rounded-full text-sm font-medium">
                  {pkg.tag}
                </span>
              )}
              
              <div className="flex space-x-2 mb-4 md:mb-0">
                <div className="flex flex-col items-center bg-[#222222] p-2 rounded-lg">
                  <GamepadIcon className="h-5 w-5 text-yellow-400 mb-1" />
                  <span className="text-xs">Exclusive Games</span>
                </div>
                
                <div className="flex flex-col items-center bg-[#222222] p-2 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-blue-400 mb-1" />
                  <span className="text-xs">Live Chat Access</span>
                </div>
              </div>

              {pkg.freeSC > 0 && (
                <div className="bg-[#003311] text-[#00FF47] px-3 py-1 rounded-lg text-sm mb-4 md:mb-0">
                  💵 FREE SC {pkg.freeSC}
                </div>
              )}

              <Button 
                className="flex items-center space-x-2 w-full md:w-auto bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-semibold rounded-full px-8"
                onClick={() => handlePurchase(pkg)}
                disabled={isProcessing || isBTCPayLoading}
              >
                {isProcessing || isBTCPayLoading ? (
                  <span>Processing...</span>
                ) : !account ? (
                  <div className="flex flex-col items-center">
                    <span>${pkg.usdPrice}</span>
                    <span className="text-sm opacity-75">Connect Wallet</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span>${pkg.usdPrice}</span>
                    <span className="text-sm opacity-75">Buy Now</span>
                  </div>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Payment Method</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="eth" className="w-full" onValueChange={(value) => setPaymentMethod(value as 'eth' | 'btc')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="eth">Ethereum</TabsTrigger>
              <TabsTrigger value="btc">Bitcoin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="eth" className="mt-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">{selectedPackage?.price} ETH</p>
                  <p className="text-sm text-muted-foreground">(${selectedPackage?.usdPrice})</p>
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleETHPurchase}
                  disabled={isProcessing}
                >
                  {!account ? (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </>
                  ) : isProcessing ? (
                    'Processing...'
                  ) : (
                    'Pay with ETH'
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="btc" className="mt-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">{selectedPackage?.btcPrice} BTC</p>
                  <p className="text-sm text-muted-foreground">(${selectedPackage?.usdPrice})</p>
                </div>
                
                {currentInvoice && (
                  <div className="w-full max-w-[200px] mx-auto">
                    <QRCode value={currentInvoice.checkoutLink} />
                  </div>
                )}
                
                <Button
                  className="w-full"
                  onClick={handleBTCPurchase}
                  disabled={isBTCPayLoading}
                >
                  {isBTCPayLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      <Bitcoin className="w-4 h-4 mr-2" />
                      Pay with BTC
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};