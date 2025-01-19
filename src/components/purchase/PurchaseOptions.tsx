import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, MessageCircle, GamepadIcon } from "lucide-react";
import { toast } from "sonner";

const packages = [
  { 
    id: 1, 
    coins: 8000, 
    price: 1.99, 
    freeSC: 0,
    tag: null 
  },
  { 
    id: 2, 
    coins: 20000, 
    price: 4.99, 
    freeSC: 5,
    tag: null 
  },
  { 
    id: 3, 
    coins: 40000, 
    price: 9.99, 
    freeSC: 10,
    tag: null 
  },
  { 
    id: 4, 
    coins: 80000, 
    price: 19.99, 
    freeSC: 20,
    tag: null 
  },
  { 
    id: 5, 
    coins: 160000, 
    price: 34.99, 
    freeSC: 40,
    tag: "FLASH OFFER" 
  },
  { 
    id: 6, 
    coins: 180000, 
    price: 38.99, 
    freeSC: 45,
    tag: "DAILY OFFER" 
  },
  { 
    id: 7, 
    coins: 200000, 
    price: 49.99, 
    freeSC: 50,
    tag: null 
  },
];

export const PurchaseOptions = () => {
  const handlePurchase = (packageOption: typeof packages[0]) => {
    toast.info("Purchase functionality coming soon!", {
      description: `Selected package: ${packageOption.coins.toLocaleString()} coins for $${packageOption.price}`,
    });
  };

  return (
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

          <div className="flex items-center justify-between flex-1 pl-8">
            {pkg.tag && (
              <span className="absolute -top-3 left-4 bg-[#00FF47] text-black px-3 py-0.5 rounded-full text-sm font-medium">
                {pkg.tag}
              </span>
            )}
            
            <div className="flex space-x-2">
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
              <div className="bg-[#003311] text-[#00FF47] px-3 py-1 rounded-lg text-sm">
                💵 FREE SC {pkg.freeSC}
              </div>
            )}

            <Button 
              className="bg-[#FF0066] hover:bg-[#FF0066]/90 text-white font-semibold rounded-full px-8 min-w-[120px]"
              onClick={() => handlePurchase(pkg)}
            >
              ${pkg.price}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};