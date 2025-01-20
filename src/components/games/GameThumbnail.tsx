import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GameThumbnailProps {
  title: string;
  description: string;
  image?: string;
  locked?: boolean;
  isNew?: boolean;
  className?: string;
}

export const GameThumbnail = ({
  title,
  description,
  image,
  locked = false,
  isNew = false,
  className
}: GameThumbnailProps) => {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-105",
      className
    )}>
      {isNew && (
        <div className="absolute top-2 left-2 z-10 bg-[#32CD32] text-black text-xs font-bold px-2 py-1 rounded">
          NEW
        </div>
      )}
      <div className="relative aspect-[3/4] overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-500/20 to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/70">{description}</p>
        </div>
      </div>
    </div>
  );
};