import { Layout, Heart, Flame, Crown, Users, Grid, Joystick } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

export const GameNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { label: "Lobby", icon: Layout, href: "/dashboard" },
    { label: "For You", icon: Heart, href: "/dashboard/for-you" },
    { label: "Popular", icon: Flame, href: "/dashboard/popular" },
    { label: "Jackpot Play", icon: Crown, href: "/dashboard/jackpot" },
    { label: "Hold and Win", icon: Joystick, href: "/dashboard/hold-and-win" },
    { label: "Social Live Casino", icon: Users, href: "/dashboard/live-casino" },
    { label: "Classic Slots", icon: Grid, href: "/dashboard/classic-slots" },
  ];

  return (
    <nav className="container overflow-x-auto">
      <div className="flex items-center gap-2 px-4 py-2 min-w-max">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-white/80 hover:bg-white/5"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};