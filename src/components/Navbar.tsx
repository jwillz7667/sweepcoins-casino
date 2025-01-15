import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/60 z-50 border-b border-secondary/20">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <Coins className="h-6 w-6 text-accent animate-float animate-glow" />
          <span className="text-xl font-bold text-foreground">SweepCoins Casino</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <div className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
                <Coins className="inline h-4 w-4 text-accent mr-1.5" />
                <span className="text-accent font-medium">
                  {user.sweepcoins.toLocaleString()}
                </span>
              </div>
              <Button 
                variant="secondary"
                size="sm"
                className="bg-[#39FF14] hover:bg-[#39FF14]/90 text-primary font-semibold shadow-lg shadow-[#39FF14]/20 animate-slow-pulse transition-all duration-300 sm:size-lg"
              >
                <Link to="/purchase" className="flex items-center gap-1 sm:gap-2">
                  <Coins className="h-4 w-4" />
                  <span className="text-sm sm:text-base">Buy</span>
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-accent hover:bg-accent/10"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-foreground hover:text-accent hover:bg-accent/10">
                <Link to="/auth">Login</Link>
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 neo-blur">
                <Link to="/auth">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};