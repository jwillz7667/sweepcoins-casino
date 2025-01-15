import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { GameCategories } from "@/components/games/GameCategories";
import { CTASection } from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary/90">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <GameCategories />
      <CTASection />
    </div>
  );
};

export default Index;