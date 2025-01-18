import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary/90">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};

export default Index;