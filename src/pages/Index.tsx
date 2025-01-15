import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Coins, Trophy, Gamepad, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary/90">
      <Navbar />
      
      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-morphism p-6 rounded-lg neo-blur">
            <Coins className="h-12 w-12 text-secondary mb-4 animate-glow" />
            <h3 className="text-xl font-bold text-foreground mb-2">Daily Bonuses</h3>
            <p className="text-foreground/80">
              Get free SweepCoins every day just by logging in!
            </p>
          </div>
          <div className="glass-morphism p-6 rounded-lg neo-blur">
            <Gamepad className="h-12 w-12 text-accent mb-4 animate-glow" />
            <h3 className="text-xl font-bold text-foreground mb-2">Exciting Games</h3>
            <p className="text-foreground/80">
              Play our collection of thrilling casino games.
            </p>
          </div>
          <div className="glass-morphism p-6 rounded-lg neo-blur">
            <Trophy className="h-12 w-12 text-secondary mb-4 animate-glow" />
            <h3 className="text-xl font-bold text-foreground mb-2">Win Prizes</h3>
            <p className="text-foreground/80">
              Redeem your SweepCoins for amazing rewards!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;