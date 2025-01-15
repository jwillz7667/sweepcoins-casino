import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { GameCard } from "@/components/GameCard";
import { Coins, Trophy, Gamepad, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// Sample game data - in a real app, this would come from an API
const featuredGames = [
  {
    title: "Lucky Slots",
    description: "Classic slot machine with modern twists and huge jackpots",
    image: "/placeholder.svg"
  },
  {
    title: "Blackjack Pro",
    description: "Test your skills against our AI dealer",
    image: "/placeholder.svg"
  },
  {
    title: "Crypto Roulette",
    description: "European roulette with a crypto twist",
    image: "/placeholder.svg",
    locked: true
  },
  {
    title: "Poker Room",
    description: "Texas Hold'em with friends or strangers",
    image: "/placeholder.svg",
    locked: true
  }
];

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

      {/* Game Lobby Section */}
      <section className="container py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured Games</h2>
            <p className="text-foreground/80">Try your luck with our most popular games</p>
          </div>
          <Button variant="ghost" className="text-secondary hover:text-secondary/80">
            <Link to="/games" className="flex items-center space-x-2">
              <span>View All Games</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGames.map((game, index) => (
            <GameCard
              key={index}
              title={game.title}
              description={game.description}
              image={game.image}
              locked={game.locked}
              className="backdrop-blur-sm"
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
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
            <Link to="/register" className="flex items-center space-x-2">
              <span>Claim Your Bonus</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;