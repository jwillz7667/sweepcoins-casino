import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GameStats } from "./GameStats";

interface GameDialogContentProps {
  title: string;
  description: string;
  gameplay: string;
  volatility: "low" | "medium" | "high";
  rtp: number;
  locked?: boolean;
}

export const GameDialogContent = ({
  title,
  description,
  gameplay,
  volatility,
  rtp,
  locked
}: GameDialogContentProps) => {
  return (
    <DialogContent className="sm:max-w-[600px] glass-morphism bg-primary/95">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-white">{title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div className="aspect-video overflow-hidden rounded-lg">
          <img 
            src={gameplay} 
            alt={`${title} gameplay`} 
            className="h-full w-full object-cover"
          />
        </div>
        
        <GameStats volatility={volatility} rtp={rtp} />

        <div className="space-y-2">
          <div className="text-sm text-gray-400">Description</div>
          <p className="text-gray-200">{description}</p>
        </div>

        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          {locked ? "Coming Soon" : "Play Now"}
        </Button>
      </div>
    </DialogContent>
  );
};