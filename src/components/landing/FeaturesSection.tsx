import { Coins, Trophy, Gamepad } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="container py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-morphism p-8 rounded-lg neo-blur">
          <Coins className="h-12 w-12 text-secondary mb-4 animate-glow" />
          <h3 className="text-xl font-bold text-foreground mb-2">Daily Bonuses</h3>
          <p className="text-foreground/80">
            Get free SweepCoins every day just by logging in!
          </p>
        </div>
        <div className="glass-morphism p-8 rounded-lg neo-blur">
          <Gamepad className="h-12 w-12 text-accent mb-4 animate-glow" />
          <h3 className="text-xl font-bold text-foreground mb-2">Exciting Games</h3>
          <p className="text-foreground/80">
            Play our collection of thrilling casino games.
          </p>
        </div>
        <div className="glass-morphism p-8 rounded-lg neo-blur">
          <Trophy className="h-12 w-12 text-secondary mb-4 animate-glow" />
          <h3 className="text-xl font-bold text-foreground mb-2">Win Prizes</h3>
          <p className="text-foreground/80">
            Redeem your SweepCoins for amazing rewards!
          </p>
        </div>
      </div>
    </section>
  );
};