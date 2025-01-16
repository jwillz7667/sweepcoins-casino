import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="container py-20">
      <div className="glass-morphism rounded-2xl p-12 text-center neo-blur">
        <Sparkles className="h-16 w-16 text-accent mx-auto mb-6 animate-glow" />
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ready to Start Winning?
        </h2>
        <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
          Join thousands of players and start your winning streak today. Get 1000 SweepCoins as a welcome bonus!
        </p>
        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 neo-blur">
          <Link to="/auth" className="flex items-center space-x-2">
            <span>Claim Your Bonus</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};