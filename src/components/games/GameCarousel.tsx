import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { GameCard } from "@/components/GameCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface Game {
  title: string;
  description: string;
  image?: string;
  locked?: boolean;
  isNew?: boolean;
}

interface GameCarouselProps {
  games: Game[];
}

export const GameCarousel = ({ games }: GameCarouselProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="relative">
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