import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const PromotionalBanner = () => {
  const banners = [
    {
      title: "DAILY COMPETITIONS",
      heading: "LOOKING FOR FREE COINS?",
      subheading: "ENTER OUR COMPETITIONS ON SOCIAL MEDIA TO WIN COINS",
      image: "/placeholder.svg",
      bgColor: "from-indigo-900 to-violet-900"
    },
    {
      title: "LOYALTY CLUB",
      heading: "SWEEPCOINS LOYALTY CLUB",
      subheading: "Earn rewards as you play",
      image: "/placeholder.svg",
      bgColor: "from-amber-900 to-orange-900"
    }
  ];

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {banners.map((banner, index) => (
          <CarouselItem key={index}>
            <div className={`relative h-48 sm:h-64 w-full bg-gradient-to-r ${banner.bgColor} overflow-hidden`}>
              <div className="absolute inset-0 flex items-center justify-between p-6 sm:p-12">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium text-white">
                    {banner.title}
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white">
                    {banner.heading}
                  </h2>
                  <p className="text-sm sm:text-base text-white/80">
                    {banner.subheading}
                  </p>
                </div>
                <div className="hidden sm:block w-1/3">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 bg-black/20 hover:bg-black/40 border-0" />
      <CarouselNext className="right-4 bg-black/20 hover:bg-black/40 border-0" />
    </Carousel>
  );
};