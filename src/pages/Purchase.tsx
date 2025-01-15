import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { PurchaseOptions } from "@/components/purchase/PurchaseOptions";

export const Purchase = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary/90">
      <Navbar />
      <main className="container py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Purchase SweepCoins
          </h1>
          <PurchaseOptions />
        </div>
      </main>
    </div>
  );
};