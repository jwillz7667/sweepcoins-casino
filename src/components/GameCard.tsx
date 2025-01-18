import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Gamepad2, Lock, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  title: string;
  description: string;
  image?: string;
  locked?: boolean;
  className?: string;
  volatility?: "low" | "medium" | "high";
  rtp?: number;
  gameplay?: string;
}

export const GameCard = ({ 
  title, 
  description, 
  image, 
  locked = false, 
  className,
  volatility = "medium",
  rtp = 96.5,
  gameplay = "/placeholder.svg"
}: GameCardProps) => {
  const getVolatilityColor = (vol: string) => {
    switch (vol) {
      case "low":
        return "text-green-500";
      case "high":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className={cn("group relative overflow-hidden transition-all hover:shadow-xl cursor-pointer flex flex-col glass-morphism", className)}>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />
          {image ? (
            <div className="h-48 overflow-hidden rounded-t-lg">
              <img src={image} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center bg-secondary/10 rounded-t-lg">
              <Gamepad2 className="h-20 w-20 text-secondary/20" />
            </div>
          )}
          <CardHeader className="relative flex-grow">
            <CardTitle className="flex items-center gap-2 text-xl">
              {title}
              {locked && <Lock className="h-4 w-4 text-accent" />}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="relative mt-auto">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 neo-blur">
              {locked ? "Coming Soon" : "Play Now"}
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] glass-morphism">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-video overflow-hidden rounded-lg">
            <img 
              src={gameplay} 
              alt={`${title} gameplay`} 
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Volatility</div>
              <div className="flex items-center gap-2">
                <Gauge className={cn("h-5 w-5", getVolatilityColor(volatility))} />
                <span className="font-semibold capitalize">{volatility}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Return to Player</div>
              <div className="font-semibold">{rtp}%</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Description</div>
            <p>{description}</p>
          </div>

          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {locked ? "Coming Soon" : "Play Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};