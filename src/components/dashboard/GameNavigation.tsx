import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GameNavigationProps {
  className?: string;
}

export const GameNavigation = ({ className }: GameNavigationProps) => {
  return (
    <nav className={cn("flex flex-wrap gap-4", className)}>
      <Button asChild variant="outline">
        <Link to="/games">All Games</Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/games?category=slots">Slots</Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/games?category=table">Table Games</Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/games?category=live">Live Casino</Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/games?category=new">New Games</Link>
      </Button>
    </nav>
  );
};