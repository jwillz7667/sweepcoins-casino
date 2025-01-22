import { GameCarousel } from "./GameCarousel";
import { GameCategoryHeader } from "./GameCategoryHeader";
import type { GameCategory } from "@/data/gameCategories";

interface GameCategorySectionProps {
  categoryId: string;
  category: GameCategory;
}

export const GameCategorySection = ({ categoryId, category }: GameCategorySectionProps) => {
  return (
    <div id={categoryId} className="space-y-4 scroll-mt-32">
      <GameCategoryHeader title={category.title} Icon={category.icon} />
      <GameCarousel {...category} />
    </div>
  );
};