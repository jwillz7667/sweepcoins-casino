import { Flame, Joystick, Layout, Crown, Star, Heart } from "lucide-react";

export interface Game {
  title: string;
  description: string;
  image: string;
  volatility: "low" | "medium" | "high";
  rtp: number;
  gameplay: string;
  isNew?: boolean;
}

export interface GameCategory {
  title: string;
  icon: typeof Star;
  games: Game[];
}

export const gameCategories: Record<string, GameCategory> = {
  featured: {
    title: "Featured Games",
    icon: Star,
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
    icon: Joystick,
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
    icon: Crown,
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
    icon: Flame,
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
    icon: Heart,
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
    icon: Layout,
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