import { Navbar } from "@/components/Navbar";
import { UserWelcome } from "@/components/dashboard/UserWelcome";
import { GameCategories } from "@/components/games/GameCategories";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary/90">
      <Navbar />
      <UserWelcome />
      <main className="container pb-12 space-y-8">
        <GameCategories />
        <TransactionHistory />
      </main>
    </div>
  );
};