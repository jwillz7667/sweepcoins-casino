import { Navbar } from "@/components/Navbar";
import { UserWelcome } from "@/components/dashboard/UserWelcome";
import { GameCategories } from "@/components/games/GameCategories";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary/90">
      <Navbar />
      <UserWelcome />
      <GameCategories />
    </div>
  );
};