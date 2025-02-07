import { Coins } from "lucide-react";
import { useAuth } from "@/contexts";
import { Card, CardContent } from "@/components/ui/card";

export const UserWelcome = () => {
  const { user } = useAuth();

  return (
    <section className="container pt-32 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.username}!
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Card className="bg-secondary/10 border-secondary/20">
            <CardContent className="flex items-center p-6">
              <div className="flex items-center gap-3">
                <Coins className="h-8 w-8 text-accent animate-float animate-glow" />
                <div>
                  <p className="text-sm text-foreground/80">Balance</p>
                  <p className="text-2xl font-bold text-foreground">
                    {user?.sweepcoins} SC
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};