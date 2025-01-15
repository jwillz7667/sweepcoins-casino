import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="container pt-32 pb-20">
      <div className="flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          Welcome to <span className="text-accent animate-glow">SweepCoins</span> Casino
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl">
          Experience the thrill of casino games with our virtual currency. Play, win, and redeem amazing prizes!
        </p>
        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 neo-blur">
          <Link to="/register" className="flex items-center space-x-2">
            <span>Start Playing Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};