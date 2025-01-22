import { LucideIcon } from "lucide-react";

interface GameCategoryHeaderProps {
  title: string;
  Icon: LucideIcon;
}

export const GameCategoryHeader = ({ title, Icon }: GameCategoryHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-6 w-6 text-accent" />
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <button className="text-white/80 hover:text-white">
        View all →
      </button>
    </div>
  );
};