import { Button } from "@/components/ui/button";
import { Coins, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchDialog } from "./SearchDialog";
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
    <nav className="border-b">
      <div className="container flex h-20 items-center px-4">
        <div className="flex w-full items-center justify-between gap-6">
          <Link to="/" className="flex items-center space-x-3">
            <Coins className="h-7 w-7 text-yellow-400" />
            <span className="text-xl font-bold">SweepCoins</span>
          </Link>
          {user ? (
            <>
              <div className="flex flex-1 items-center justify-center gap-8">
                <span className="text-sm text-muted-foreground flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg">
                  <Coins className="h-4 w-4 text-yellow-400" />
                  {user.sweepcoins} SC
                </span>
                <Link to="/purchase">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-6">
                    BUY COINS
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <SearchDialog />
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