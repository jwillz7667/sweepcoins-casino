import { useAuth } from "@/contexts/AuthContext";
import { PurchaseOptions } from "@/components/purchase/PurchaseOptions";
import { Coins } from "lucide-react";

export const Purchase = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Purchase Game Coins
            </h1>
            <div className="flex items-center space-x-2 text-yellow-400">
              <Coins className="h-6 w-6" />
              <span className="font-medium">Current Balance: 0 GC</span>
            </div>
          </div>
          <PurchaseOptions />
        </div>
      </main>
    </div>
  );
};