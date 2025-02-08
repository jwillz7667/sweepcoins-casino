import { memo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type Package } from '@/types/package';
import { cn } from '@/lib/utils';

interface PurchaseCardProps {
  package: Package;
  onSelect: () => void;
}

export const PurchaseCard = memo(({ package: pkg, onSelect }: PurchaseCardProps) => {
  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300',
      pkg.featured && 'border-yellow-500 ring-2 ring-yellow-500/20'
    )}>
      {pkg.featured && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-black px-3 py-1 text-sm font-medium rounded-bl">
          Featured
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{pkg.name}</CardTitle>
        <CardDescription>{pkg.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-3xl font-bold text-zinc-100">{pkg.coins.toLocaleString()}</span>
          <span className="text-sm text-zinc-400 ml-2">coins</span>
        </div>
        
        <div className="text-center">
          <span className="text-2xl font-semibold text-zinc-100">{pkg.btcPrice} BTC</span>
          {pkg.discountPercentage && (
            <div className="text-sm text-green-500 font-medium">
              Save {pkg.discountPercentage}%
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onSelect}
          className="w-full"
          variant={pkg.featured ? 'default' : 'outline'}
        >
          Purchase Now
        </Button>
      </CardFooter>
    </Card>
  );
});

PurchaseCard.displayName = 'PurchaseCard'; 