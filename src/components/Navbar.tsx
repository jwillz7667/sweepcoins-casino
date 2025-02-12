"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchDialog } from "@/components/SearchDialog";
import { useAuth } from "@/contexts";

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-2">
        <div className="flex w-full items-center justify-between gap-2">
          <Link to="/dashboard" className="flex items-center space-x-2 transition-transform hover:scale-105">
            <Coins className="h-6 w-6 text-yellow-400" />
            <span className="text-lg font-bold">SweepCoins</span>
          </Link>
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-full shadow-sm hover:bg-accent/20 transition-all">
                  <Coins className="h-3 w-3 text-yellow-400" />
                  {user.sweepcoins}
                </span>
                <Link to="/purchase">
                  <Button size="sm" className="rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">BUY</Button>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <SearchDialog />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                      <span className="sr-only">Open menu</span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
                    <DropdownMenuItem className="rounded-lg focus:bg-accent/20">
                      <Link to="/dashboard" className="w-full">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg focus:bg-accent/20">
                      <Link to="/purchase" className="w-full">
                        Purchase Coins
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="rounded-lg focus:bg-accent/20">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <Link to="/auth">
              <Button className="rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
