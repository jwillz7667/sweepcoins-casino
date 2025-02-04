import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

const PurchaseSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");

  useEffect(() => {
    if (!invoiceId) {
      toast.error("Invalid payment session");
      navigate("/purchase");
      return;
    }

    // You might want to verify the payment status here
    toast.success("Payment successful! Your coins have been credited to your account.");
  }, [invoiceId, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Coins className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        
        <p className="text-muted-foreground">
          Thank you for your purchase. Your game coins have been credited to your account.
        </p>
        
        <div className="flex flex-col space-y-2">
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full"
          >
            Go to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate("/games")}
            className="w-full"
          >
            Start Playing
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PurchaseSuccess; 