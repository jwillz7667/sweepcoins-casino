import { DialogContent } from '@/components/ui/dialog';

interface GameDialogContentProps {
  title: string;
  description: string;
  gameplay?: string;
  volatility?: 'Low' | 'Medium' | 'High';
  rtp?: number;
  locked?: boolean;
}

export const GameDialogContent = ({
  title,
  description,
  gameplay,
  volatility,
  rtp,
  locked,
}: GameDialogContentProps) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
        {gameplay && (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img src={gameplay} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        {volatility && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Volatility:</span>
            <span className="text-sm text-muted-foreground">{volatility}</span>
          </div>
        )}
        {rtp && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">RTP:</span>
            <span className="text-sm text-muted-foreground">{rtp}%</span>
          </div>
        )}
        {locked && (
          <div className="text-sm text-yellow-500">
            This game requires unlocking to play.
          </div>
        )}
      </div>
    </DialogContent>
  );
};