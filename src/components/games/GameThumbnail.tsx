import { cn } from '@/lib/utils';

export interface GameThumbnailProps {
  title: string;
  image?: string;
  isNew?: boolean;
  locked?: boolean;
  className?: string;
  onClick?: () => void;
}

export const GameThumbnail = ({
  title,
  image,
  isNew,
  locked,
  className,
  onClick,
}: GameThumbnailProps) => {
  return (
    <div
      className={cn(
        'relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group',
        locked && 'opacity-50',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <img
        src={image || '/placeholder.svg'}
        alt={title}
        className="w-full h-full object-cover transition-transform group-hover:scale-110"
      />
      {isNew && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
          New
        </div>
      )}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="text-white font-medium">Locked</span>
        </div>
      )}
    </div>
  );
};