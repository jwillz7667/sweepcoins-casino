import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameThumbnailProps {
  title: string;
  description: string;
  image?: string;
  locked?: boolean;
  className?: string;
}

export const GameThumbnail = ({
  title,
  description,
  image,
  locked = false,
  className
}: GameThumbnailProps) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all hover:shadow-xl cursor-pointer flex flex-col glass-morphism bg-white/10",
      "hover:bg-white/15",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-80" />
      {image ? (
        <div className="h-48 overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover transition-transform group-hover:scale-105" 
          />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center bg-secondary/20 rounded-t-lg">
          <Gamepad2 className="h-20 w-20 text-secondary opacity-50" />
        </div>
      )}
      <CardHeader className="relative flex-grow bg-gradient-to-b from-transparent to-primary/40">
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          {title}
          {locked && <Lock className="h-4 w-4 text-accent animate-pulse" />}
        </CardTitle>
        <CardDescription className="text-gray-200">{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative mt-auto">
        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 neo-blur">
          {locked ? "Coming Soon" : "Play Now"}
        </Button>
      </CardContent>
    </Card>
  );
};