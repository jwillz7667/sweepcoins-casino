import { Navbar } from "@/components/Navbar";
import { GameCategories } from "@/components/games/GameCategories";
import { PromotionalBanner } from "@/components/dashboard/PromotionalBanner";
import { GameNavigation } from "@/components/dashboard/GameNavigation";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="relative">
        {/* Promotional Banners */}
        <div className="relative z-0">
          <PromotionalBanner />
        </div>

        {/* Sticky Navigation */}
        <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
          <Navbar />
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