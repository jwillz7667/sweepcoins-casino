import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  title: string;
  description: string;
  image?: string;
  locked?: boolean;
  className?: string;
}

export const GameCard = ({ title, description, image, locked = false, className }: GameCardProps) => {
  return (
    <Card className={cn("group relative overflow-hidden transition-all hover:shadow-xl", className)}>
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />
      {image ? (
        <div className="h-48 overflow-hidden">
          <img src={image} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center bg-secondary/10">
          <Gamepad2 className="h-20 w-20 text-secondary/20" />
        </div>
      )}
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-xl">
          {title}
          {locked && <Lock className="h-4 w-4 text-accent" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 neo-blur">
          {locked ? "Coming Soon" : "Play Now"}
        </Button>
      </CardContent>
    </Card>
  );
};