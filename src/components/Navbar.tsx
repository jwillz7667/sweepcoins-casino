import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/60 z-50 border-b border-secondary/20">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Coins className="h-6 w-6 text-accent animate-float animate-glow" />
          <span className="text-xl font-bold text-foreground">SweepCoins Casino</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-foreground hover:text-accent hover:bg-accent/10">
            <Link to="/login">Login</Link>
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 neo-blur">
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};