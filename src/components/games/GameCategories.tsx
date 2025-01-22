import { GameCategorySection } from "./GameCategorySection";
import { gameCategories } from "@/data/gameCategories";

export const GameCategories = () => {
  return (
    <section className="space-y-8">
      {Object.entries(gameCategories).map(([key, category]) => (
        <GameCategorySection key={key} categoryId={key} category={category} />
      ))}
    </section>
  );
};