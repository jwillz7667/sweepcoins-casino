import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GameStats } from "./GameStats";
import { Info } from "lucide-react";

interface GameDialogContentProps {
  title: string;
  description: string;
  gameplay: string;
  volatility: "low" | "medium" | "high";
  rtp: number;
  locked?: boolean;
  minBet?: { gc: number; sc: number };
  maxBet?: { gc: number; sc: number };
  maxWinMultiplier?: number;
}

export const GameDialogContent = ({
  title,
  description,
  gameplay,
  volatility,
  rtp,
  locked,
  minBet = { gc: 70, sc: 0.20 },
  maxBet = { gc: 777770, sc: 300 },
  maxWinMultiplier = 5000
}: GameDialogContentProps) => {
  return (
    <DialogContent className="sm:max-w-[600px] bg-black/95 p-0 gap-0">
      <div className="space-y-4">
        {/* Game Preview */}
        <div className="relative aspect-video">
          <img 
            src={gameplay} 
            alt={`${title} gameplay`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <button className="p-2 rounded-full bg-black/50 hover:bg-black/70">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Info */}
        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">{title}</DialogTitle>
            <p className="text-sm text-gray-400">{description}</p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Game Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Min spin</div>
                <div className="text-white">
                  GC {minBet.gc.toLocaleString()} / SC {minBet.sc}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Max spin</div>
                <div className="text-white">
                  GC {maxBet.gc.toLocaleString()} / SC {maxBet.sc}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Max Win Multiplier</div>
                <div className="text-white">{maxWinMultiplier}x</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Volatility</div>
                <div className="text-white capitalize">{volatility}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4">
              <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold py-6">
                Play with Gold Coins
              </Button>
              <Button className="w-full bg-[#32CD32] hover:bg-[#32CD32]/90 text-black font-semibold py-6">
                <span className="mr-2">💰</span>
                Enter Sweepstakes
              </Button>
            </div>

            {/* Jackpot Info */}
            <div className="bg-black/50 rounded-lg p-4 mt-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <img src="/placeholder.svg" alt="McJackpot" className="h-8" />
                  <img src="/placeholder.svg" alt="McJackpot" className="h-8" />
                </div>
                <Button variant="outline" className="border-[#32CD32] text-[#32CD32] hover:bg-[#32CD32] hover:text-black">
                  Opt In to McJackpots
                </Button>
              </div>
              <div className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                Exclusive Jackpots available
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};