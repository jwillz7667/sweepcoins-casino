import { GameCarousel } from "./GameCarousel";
import { Flame, Joystick, Layout, Dice1 } from "lucide-react";

export const gameCategories = {
  holdAndWin: {
    title: "Hold & Win",
    icon: <Flame className="h-6 w-6 text-accent" />,
    games: [
      {
        title: "Tundra Wolf",
        description: "PLAYTECH",
        image: "/placeholder.svg",
        volatility: "medium",
        rtp: 96.5,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Piglets and the Bank",
        description: "PLAYTECH",
        image: "/placeholder.svg",
        volatility: "low",
        rtp: 99.5,
        gameplay: "/placeholder.svg",
        isNew: true
      },
      {
        title: "Gold Party",
        description: "PRAGMATIC PLAY",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 97.3,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Red Wizard",
        description: "PLAYTECH",
        image: "/placeholder.svg",
        volatility: "medium",
        rtp: 98.5,
        gameplay: "/placeholder.svg"
      }
    ]
  },
  jackpotPlay: {
    title: "Jackpot Play",
    icon: <Layout className="h-6 w-6 text-accent" />,
    games: [
      {
        title: "Joker's Jewels",
        description: "SC 309,883.11",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 95.8,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Big Bass Bonanza",
        description: "SC 309,883.11",
        image: "/placeholder.svg",
        volatility: "medium",
        rtp: 96.2,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Big Bass Splash",
        description: "SC 309,883.11",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 96.8,
        gameplay: "/placeholder.svg"
      }
    ]
  }
};

export const GameCategories = () => {
  return (
    <section className="space-y-8">
      {Object.entries(gameCategories).map(([key, category]) => (
        <div key={key} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{category.title}</h2>
            </div>
            <button className="text-white/80 hover:text-white">
              View all →
            </button>
          </div>
          <GameCarousel {...category} />
        </div>
      ))}
    </section>
  );
};