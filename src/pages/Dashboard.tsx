import { Navbar } from "@/components/Navbar";
import { UserWelcome } from "@/components/dashboard/UserWelcome";
import { GameCategories } from "@/components/games/GameCategories";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container px-4 py-4 space-y-6">
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full bg-accent/10 text-white border border-accent/20">
              Lobby
            </button>
            <button className="px-6 py-2 rounded-full bg-white/5 text-white/80 hover:bg-white/10">
              For You
            </button>
            <button className="px-6 py-2 rounded-full bg-white/5 text-white/80 hover:bg-white/10">
              Popular
            </button>
            <button className="px-6 py-2 rounded-full bg-white/5 text-white/80 hover:bg-white/10">
              New & Exclusive
            </button>
          </div>
        </div>
        <GameCategories />
      </main>
    </div>
  );
};