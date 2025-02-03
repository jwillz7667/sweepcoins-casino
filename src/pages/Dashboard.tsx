import { GameCategories } from "@/components/games/GameCategories";
import { PromotionalBanner } from "@/components/dashboard/PromotionalBanner";
import { GameNavigation } from "@/components/dashboard/GameNavigation";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        {/* Promotional Banners */}
        <div className="relative">
          <PromotionalBanner />
        </div>

        {/* Sticky Navigation */}
        <div className="sticky top-0 z-50 transition-all duration-300 ease-in-out bg-[#111111] border-b border-white/10">
          <div className="border-t border-white/5">
            <GameNavigation />
          </div>
        </div>

        {/* Main Content */}
        <main className="container px-4 py-6 space-y-8">
          <GameCategories />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;