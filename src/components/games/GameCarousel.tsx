import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { GameCard } from "@/components/GameCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface Game {
  title: string;
  description: string;
  image?: string;
  locked?: boolean;
}

interface GameCarouselProps {
  title: string;
  icon: React.ReactNode;
  games: Game[];
}

export const GameCarousel = ({ title, icon, games }: GameCarouselProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
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
                className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
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
};