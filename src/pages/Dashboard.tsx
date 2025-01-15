import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { GameCard } from "@/components/GameCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Coins, Gamepad2, Layout, Dice1, Joystick } from "lucide-react";

// Sample game data organized by categories
const gameCategories = {
  recommended: {
    title: "Recommended for You",
    icon: <Gamepad2 className="h-6 w-6 text-accent" />,
    games: [
      {
        title: "Lucky Slots",
        description: "Classic slot machine with modern twists",
        image: "/placeholder.svg"
      },
      {
        title: "Blackjack Pro",
        description: "Test your skills against our AI dealer",
        image: "/placeholder.svg"
      },
      {
        title: "Poker Room",
        description: "Texas Hold'em with friends",
        image: "/placeholder.svg"
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
        image: "/placeholder.svg"
      },
      {
        title: "Space Adventure",
        description: "Cosmic slots with out-of-this-world prizes",
        image: "/placeholder.svg"
      },
      {
        title: "Golden Egypt",
        description: "Ancient Egyptian treasures await",
        image: "/placeholder.svg"
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
        image: "/placeholder.svg"
      },
      {
        title: "European Roulette",
        description: "Single-zero roulette wheel",
        image: "/placeholder.svg"
      },
      {
        title: "Baccarat Royal",
        description: "High-stakes baccarat action",
        image: "/placeholder.svg"
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
        image: "/placeholder.svg"
      },
      {
        title: "Sic Bo",
        description: "Ancient Chinese dice game",
        image: "/placeholder.svg"
      }
    ]
  }
};

const GameCarousel = ({ title, icon, games }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
    <div className="relative">
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {games.map((game, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <GameCard {...game} className="h-full" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  </div>
);

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary/90">
      <Navbar />
      
      {/* User Welcome Section */}
      <section className="container pt-32 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-foreground/80">
              Your balance: <Coins className="inline h-4 w-4 text-accent" /> {user?.sweepcoins} SweepCoins
            </p>
          </div>
        </div>
      </section>

      {/* Game Categories Section */}
      <section className="container py-12 space-y-12">
        {Object.entries(gameCategories).map(([key, category]) => (
          <GameCarousel key={key} {...category} />
        ))}
      </section>
    </div>
  );
};