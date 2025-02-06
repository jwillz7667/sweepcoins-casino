import React from 'react';
import { cn } from '@/lib/utils';

interface GameThumbnailProps {
  title: string;
  image?: string;
  isNew?: boolean;
  className?: string;
  onClick?: () => void;
}

export const GameThumbnail = ({
  title,
  image,
  isNew,
  className,
  onClick,
}: GameThumbnailProps) => {
  return (
    <div
      className={cn(
        'relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group',
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
    </div>
  );
};