import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Experience the Future of Gaming with SweepCoins
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Join thousands of players in the most innovative sweepstakes casino platform.
          </p>
          <Link to="/auth">
            <Button size="lg" className="neo-blur">
              Start Playing Now
              <span aria-hidden="true">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};