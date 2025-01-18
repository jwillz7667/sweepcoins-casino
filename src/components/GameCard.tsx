import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { GameThumbnail } from "@/components/games/GameThumbnail";
import { GameDialogContent } from "@/components/games/GameDialogContent";

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <GameThumbnail
            title={title}
            description={description}
            image={image}
            locked={locked}
            className={className}
          />
        </div>
      </DialogTrigger>

      <GameDialogContent
        title={title}
        description={description}
        gameplay={gameplay}
        volatility={volatility}
        rtp={rtp}
        locked={locked}
      />
    </Dialog>
  );
};