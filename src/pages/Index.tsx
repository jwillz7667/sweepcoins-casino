import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;