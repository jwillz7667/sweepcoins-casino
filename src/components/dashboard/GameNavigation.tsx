import { Layout, Heart, Flame, Crown, Joystick, Grid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

export const GameNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      const navHeight = 100; // Approximate height of the sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navItems = [
    { label: "Lobby", icon: Layout, href: "/dashboard", categoryId: "featured" },
    { label: "For You", icon: Heart, href: "/dashboard/for-you", categoryId: "favorites" },
    { label: "Popular", icon: Flame, href: "/dashboard/popular", categoryId: "popular" },
    { label: "Jackpot Play", icon: Crown, href: "/dashboard/jackpot", categoryId: "jackpotPlay" },
    { label: "Hold and Win", icon: Joystick, href: "/dashboard/hold-and-win", categoryId: "holdAndWin" },
    { label: "Classic Slots", icon: Grid, href: "/dashboard/classic-slots", categoryId: "megaways" },
  ];

  return (
    <nav className="container overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-3 px-4 py-3 min-w-max">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => scrollToCategory(item.categoryId)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              pathname === item.href
                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(236,72,153,0.1)]"
                : "text-white/70 hover:text-white/90 hover:bg-white/5"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};