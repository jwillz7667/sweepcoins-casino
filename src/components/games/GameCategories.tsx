import { GameCarousel } from "./GameCarousel";
import { Flame, Joystick, Layout, Dice1 } from "lucide-react";

export const gameCategories = {
  featured: {
    title: "Featured Games",
    icon: <Flame className="h-6 w-6 text-accent" />,
    games: [
      {
        title: "Lucky Slots",
        description: "Classic slot machine with modern twists and huge jackpots",
        image: "/placeholder.svg",
        volatility: "medium",
        rtp: 96.5,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Blackjack Pro",
        description: "Test your skills against our AI dealer",
        image: "/placeholder.svg",
        volatility: "low",
        rtp: 99.5,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Crypto Roulette",
        description: "European roulette with a crypto twist",
        image: "/placeholder.svg",
        locked: true,
        volatility: "high",
        rtp: 97.3,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Poker Room",
        description: "Texas Hold'em with friends or strangers",
        image: "/placeholder.svg",
        locked: true,
        volatility: "medium",
        rtp: 98.5,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Dragon's Fortune",
        description: "Asian-themed slot with progressive jackpots",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 95.8,
        gameplay: "/placeholder.svg"
      }
    ]
  },
  slots: {
    title: "Slot Machines",
    icon: <Joystick className="h-6 w-6 text-secondary" />,
    games: [
      {
        title: "Fruit Frenzy",
        description: "Classic fruit machine with a modern twist",
        image: "/placeholder.svg",
        volatility: "low",
        rtp: 96.2,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Space Adventure",
        description: "Cosmic slots with out-of-this-world prizes",
        image: "/placeholder.svg",
        volatility: "medium",
        rtp: 95.9,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Golden Egypt",
        description: "Ancient Egyptian treasures await",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 96.8,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Neon Nights",
        description: "Cyberpunk-themed slot experience",
        image: "/placeholder.svg",
        locked: true,
        volatility: "medium",
        rtp: 97.1,
        gameplay: "/placeholder.svg"
      }
    ]
  },
  table: {
    title: "Table Games",
    icon: <Layout className="h-6 w-6 text-accent" />,
    games: [
      {
        title: "Classic Blackjack",
        description: "The casino favorite card game",
        image: "/placeholder.svg",
        volatility: "low",
        rtp: 99.5,
        gameplay: "/placeholder.svg"
      },
      {
        title: "European Roulette",
        description: "Single-zero roulette wheel",
        image: "/placeholder.svg",
        volatility: "medium",
        rtp: 97.3,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Baccarat Royal",
        description: "High-stakes baccarat action",
        image: "/placeholder.svg",
        locked: true,
        volatility: "high",
        rtp: 98.9,
        gameplay: "/placeholder.svg"
      }
    ]
  },
  dice: {
    title: "Dice Games",
    icon: <Dice1 className="h-6 w-6 text-secondary" />,
    games: [
      {
        title: "Craps Master",
        description: "Classic casino craps",
        image: "/placeholder.svg",
        volatility: "medium",
        rtp: 98.6,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Sic Bo",
        description: "Ancient Chinese dice game",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 97.2,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Dice Poker",
        description: "Poker variant with dice",
        image: "/placeholder.svg",
        locked: true,
        volatility: "medium",
        rtp: 96.4,
        gameplay: "/placeholder.svg"
      }
    ]
  }
};

export const GameCategories = () => {
  return (
    <section className="container py-20 space-y-12">
      {Object.entries(gameCategories).map(([key, category]) => (
        <GameCarousel key={key} {...category} />
      ))}
    </section>
  );
};