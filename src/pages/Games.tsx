import { FC } from "react";
import { GameCard } from "@/components/GameCard";

const Games: FC = () => {
  const games = [
    {
      id: 1,
      title: "Slots Paradise",
      description: "Experience the thrill of our most popular slot games",
      image: "/games/slots.jpg",
      volatility: "high" as const,
      rtp: 96.5,
    },
    {
      id: 2,
      title: "Blackjack Pro",
      description: "Classic blackjack with modern twists",
      image: "/games/blackjack.jpg",
      volatility: "low" as const,
      rtp: 99.5,
    },
    {
      id: 3,
      title: "Roulette Royale",
      description: "European and American roulette variants",
      image: "/games/roulette.jpg",
      volatility: "medium" as const,
      rtp: 97.3,
    },
    {
      id: 4,
      title: "Poker Master",
      description: "Texas Hold'em and other popular variants",
      image: "/games/poker.jpg",
      volatility: "medium" as const,
      rtp: 98.2,
    },
    {
      id: 5,
      title: "Lucky Dice",
      description: "Fast-paced dice games with instant wins",
      image: "/games/dice.jpg",
      volatility: "high" as const,
      rtp: 95.8,
    },
    {
      id: 6,
      title: "Baccarat Elite",
      description: "High-stakes baccarat action",
      image: "/games/baccarat.jpg",
      volatility: "low" as const,
      rtp: 98.9,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Games</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Discover our extensive collection of casino games, from classic table games to exciting slots and instant win opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            image={game.image}
            volatility={game.volatility}
            rtp={game.rtp}
          />
        ))}
      </div>

      <div className="mt-16 bg-card rounded-lg p-8 border">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-md border border-dashed flex items-center justify-center">
            <p className="text-muted-foreground">Crash Games</p>
          </div>
          <div className="p-4 bg-background rounded-md border border-dashed flex items-center justify-center">
            <p className="text-muted-foreground">Live Casino</p>
          </div>
          <div className="p-4 bg-background rounded-md border border-dashed flex items-center justify-center">
            <p className="text-muted-foreground">Sports Betting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games; 