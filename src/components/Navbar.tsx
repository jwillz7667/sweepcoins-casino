
import { Button } from "@/components/ui/button";
import { Coins, Search, Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="container">
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Coins className="h-8 w-8 text-accent" />
          <span className="text-xl font-bold text-foreground">SweepCoins Casino</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
                  <Coins className="inline h-4 w-4 text-accent mr-1.5" />
                  <span className="text-accent font-medium">
                    {(user.sweepcoins || 0).toLocaleString()}
                  </span>
                </div>
                <Button 
                  variant="secondary"
                  size="sm"
                  className="bg-[#39FF14] hover:bg-[#39FF14]/90 text-primary font-semibold"
                >
                  <Link to="/purchase">Get Coins</Link>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link to="/dashboard" className="w-full">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/purchase" className="w-full">Purchase Coins</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
