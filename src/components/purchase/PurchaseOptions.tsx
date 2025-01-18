import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { toast } from "sonner";

const packages = [
  { id: 1, price: 4.99, coins: 500, popular: false },
  { id: 2, price: 9.99, coins: 1000, popular: true },
  { id: 3, price: 19.99, coins: 2000, popular: false },
  { id: 4, price: 49.99, coins: 5000, popular: false },
  { id: 5, price: 99.99, coins: 10000, popular: false },
];

export const PurchaseOptions = () => {
  const handlePurchase = (packageOption: typeof packages[0]) => {
    toast.info("Purchase functionality coming soon!", {
      description: `Selected package: ${packageOption.coins} coins for $${packageOption.price}`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <Card 
          key={pkg.id} 
          className={`glass-morphism relative ${pkg.popular ? 'border-accent shadow-lg ring-2 ring-accent/50' : ''}`}
        >
          {pkg.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                Most Popular
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {pkg.coins.toLocaleString()} SC
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <Coins className="h-12 w-12 text-accent animate-float" />
            </div>
            <p className="text-3xl font-bold mb-2">
              ${pkg.price}
            </p>
            <p className="text-sm text-muted-foreground">
              ${(pkg.price / pkg.coins * 1000).toFixed(2)} per 1000 coins
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              size="lg"
              onClick={() => handlePurchase(pkg)}
            >
              Buy Now
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};