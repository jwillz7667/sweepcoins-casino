import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameStatsProps {
  volatility: "low" | "medium" | "high";
  rtp: number;
}

export const GameStats = ({ volatility, rtp }: GameStatsProps) => {
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
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="text-sm text-gray-400">Volatility</div>
        <div className="flex items-center gap-2">
          <Gauge className={cn("h-5 w-5", getVolatilityColor(volatility))} />
          <span className="font-semibold capitalize text-white">{volatility}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm text-gray-400">Return to Player</div>
        <div className="font-semibold text-white">{rtp}%</div>
      </div>
    </div>
  );
};