import { Coins } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const UserWelcome = () => {
  const { user } = useAuth();

  return (
    <section className="container pt-32 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-foreground/80">
            Your balance: <Coins className="inline h-4 w-4 text-accent" /> {user?.sweepcoins} SweepCoins
          </p>
        </div>
      </div>
    </section>
  );
};