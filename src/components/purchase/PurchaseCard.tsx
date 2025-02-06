import { memo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, MessageCircle, GamepadIcon, Sparkles } from "lucide-react";
import { Package } from './packages.data';
import { cn } from '@/lib/utils';

interface PackageCardProps {
  package: Package;
  onSelect: () => void;
}

export const PackageCard = memo(({ package: pkg, onSelect }: PackageCardProps) => (
  <Card className={cn(
    "relative overflow-hidden transition-all duration-300 hover:scale-[1.02]",
    "bg-gradient-to-br from-zinc-900 to-black border-zinc-800 hover:border-zinc-700",
    "flex flex-col p-6"
  )}>
    {/* Special Tags */}
    {pkg.tag && (
      <div className="absolute -top-2 -right-12 transform rotate-45">
        <div className="bg-[#00FF47] text-black py-1 px-12 text-sm font-medium shadow-lg">
          {pkg.tag}
        </div>
      </div>
    )}

    {/* Coin Amount */}
    <div className="flex items-center gap-3 mb-6">
      <div className="relative">
        <Coins className="h-10 w-10 text-yellow-400" />
        <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold">
          {pkg.coins.toLocaleString()} GC
        </span>
        <span className="text-sm text-zinc-400">
          Game Coins
        </span>
      </div>
    </div>

    {/* Features */}
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex items-center gap-2 text-zinc-300">
        <GamepadIcon className="h-5 w-5 text-yellow-400" />
        <span>Exclusive Games Access</span>
      </div>
      <div className="flex items-center gap-2 text-zinc-300">
        <MessageCircle className="h-5 w-5 text-blue-400" />
        <span>Live Chat Access</span>
      </div>
      {pkg.freeSC > 0 && (
        <div className="flex items-center gap-2 text-[#00FF47]">
          <Sparkles className="h-5 w-5" />
          <span>FREE {pkg.freeSC} SC Bonus</span>
        </div>
      )}
    </div>

    {/* Price and Action */}
    <div className="mt-auto">
      <Button 
        onClick={onSelect}
        className={cn(
          "w-full py-6 text-lg font-semibold",
          "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400",
          "border-0 shadow-lg hover:shadow-xl transition-all duration-300"
        )}
      >
        <div className="flex flex-col items-center">
          <span>${pkg.usdPrice.toFixed(2)}</span>
          <span className="text-sm opacity-90">Buy Now</span>
        </div>
      </Button>
    </div>
  </Card>
));

PackageCard.displayName = 'PackageCard'; 