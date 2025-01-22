import { GameCarousel } from "./GameCarousel";
import { Flame, Joystick, Layout, Crown, Star, Trophy, Heart } from "lucide-react";

export const gameCategories = {
  featured: {
    title: "Featured Games",
    icon: <Star className="h-6 w-6 text-accent" />,
    games: [
      {
        title: "Elemental Gems",
        description: "PRAGMATIC PLAY",
        image: "/placeholder.svg",
        volatility: "medium",
        rtp: 96.5,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Lucky Dragons",
        description: "PLAYTECH",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 97.2,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Golden Wealth",
        description: "PRAGMATIC PLAY",
        image: "/placeholder.svg",
        volatility: "low",
        rtp: 95.8,
        gameplay: "/placeholder.svg"
      }
    ]
  },
  holdAndWin: {
    title: "Hold & Win",
    icon: <Joystick className="h-6 w-6 text-accent" />,
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
    title: "Jackpot Games",
    icon: <Crown className="h-6 w-6 text-accent" />,
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
  },
  popular: {
    title: "Popular Now",
    icon: <Flame className="h-6 w-6 text-accent" />,
    games: [
      {
        title: "Lucky Fortune",
        description: "PRAGMATIC PLAY",
        image: "/placeholder.svg",
        volatility: "medium",
        rtp: 96.7,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Wild West Gold",
        description: "PLAYTECH",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 97.3,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Asian Fortune",
        description: "PRAGMATIC PLAY",
        image: "/placeholder.svg",
        volatility: "medium",
        rtp: 96.4,
        gameplay: "/placeholder.svg"
      }
    ]
  },
  favorites: {
    title: "For You",
    icon: <Heart className="h-6 w-6 text-accent" />,
    games: [
      {
        title: "Fortune Tiger",
        description: "PRAGMATIC PLAY",
        image: "/placeholder.svg",
        volatility: "medium",
        rtp: 96.3,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Lucky Panda",
        description: "PLAYTECH",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 97.5,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Golden Ox",
        description: "PRAGMATIC PLAY",
        image: "/placeholder.svg",
        volatility: "low",
        rtp: 95.6,
        gameplay: "/placeholder.svg"
      }
    ]
  },
  megaways: {
    title: "Classic Slots",
    icon: <Layout className="h-6 w-6 text-accent" />,
    games: [
      {
        title: "Buffalo King Megaways",
        description: "PRAGMATIC PLAY",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 96.8,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Big Bass Megaways",
        description: "PLAYTECH",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 97.2,
        gameplay: "/placeholder.svg"
      },
      {
        title: "Power of Thor Megaways",
        description: "PRAGMATIC PLAY",
        image: "/placeholder.svg",
        volatility: "high",
        rtp: 96.5,
        gameplay: "/placeholder.svg"
      }
    ]
  }
};

export const GameCategories = () => {
  return (
    <section className="space-y-8">
      {Object.entries(gameCategories).map(([key, category]) => (
        <div key={key} id={key} className="space-y-4 scroll-mt-32">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {category.icon}
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
