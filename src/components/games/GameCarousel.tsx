import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { GameCard } from "@/components/GameCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { LucideIcon } from "lucide-react";

interface Game {
  title: string;
  description: string;
  image?: string;
  locked?: boolean;
  isNew?: boolean;
}

interface GameCarouselProps {
  title: string;
  icon: LucideIcon;
  games: Game[];
}

export const GameCarousel = ({ title, icon: Icon, games }: GameCarouselProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-6 h-6" />
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: isMobile,
          containScroll: "trimSnaps"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {games.map((game, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-[38%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <GameCard {...game} className="h-full" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 bg-black/60 hover:bg-black/80" />
        <CarouselNext className="hidden md:flex -right-12 bg-black/60 hover:bg-black/80" />
      </Carousel>
    </div>
  );
};