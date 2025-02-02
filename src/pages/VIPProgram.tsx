import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VIPProgram: FC = () => {
  const vipLevels = [
    {
      name: "Bronze",
      requirements: "0 - 999 Points",
      cashback: "5%",
      withdrawalLimit: "5,000 USDT/day",
      support: "Standard",
      bonuses: "Basic",
    },
    {
      name: "Silver",
      requirements: "1,000 - 4,999 Points",
      cashback: "7%",
      withdrawalLimit: "10,000 USDT/day",
      support: "Priority",
      bonuses: "Enhanced",
    },
    {
      name: "Gold",
      requirements: "5,000 - 19,999 Points",
      cashback: "10%",
      withdrawalLimit: "25,000 USDT/day",
      support: "VIP",
      bonuses: "Premium",
    },
    {
      name: "Platinum",
      requirements: "20,000+ Points",
      cashback: "15%",
      withdrawalLimit: "Unlimited",
      support: "Personal Manager",
      bonuses: "Elite",
    },
  ];

  const benefits = [
    {
      title: "Weekly Cashback",
      description: "Earn up to 15% cashback on your weekly losses, credited automatically every Monday.",
    },
    {
      title: "Personal Account Manager",
      description: "Get a dedicated VIP manager to assist you with all your gaming needs.",
    },
    {
      title: "Exclusive Bonuses",
      description: "Access to special promotions and customized bonus offers tailored to your playing style.",
    },
    {
      title: "Higher Limits",
      description: "Enjoy increased deposit and withdrawal limits as you climb the VIP ladder.",
    },
    {
      title: "VIP Events",
      description: "Invitations to exclusive events, tournaments, and special gatherings.",
    },
    {
      title: "Birthday Bonus",
      description: "Receive a special bonus on your birthday, with amount based on your VIP level.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4">VIP Program</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Join our exclusive VIP program and experience the ultimate in premium gaming benefits and personalized service.
        </p>
      </div>

      {/* VIP Levels Table */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">VIP Levels</h2>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead>Cashback</TableHead>
                <TableHead>Withdrawal Limit</TableHead>
                <TableHead>Support</TableHead>
                <TableHead>Bonuses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vipLevels.map((level) => (
                <TableRow key={level.name}>
                  <TableCell className="font-medium">{level.name}</TableCell>
                  <TableCell>{level.requirements}</TableCell>
                  <TableCell>{level.cashback}</TableCell>
                  <TableCell>{level.withdrawalLimit}</TableCell>
                  <TableCell>{level.support}</TableCell>
                  <TableCell>{level.bonuses}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* VIP Benefits */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">VIP Benefits</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to Join */}
      <div className="bg-card rounded-lg p-8 border">
        <h2 className="text-2xl font-semibold mb-4">How to Join</h2>
        <p className="text-muted-foreground mb-6">
          Start earning VIP points immediately by playing your favorite games. Every bet contributes to your VIP status!
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-background rounded-lg border text-center">
            <h3 className="font-medium mb-2">1. Play Games</h3>
            <p className="text-sm text-muted-foreground">Earn 1 point for every 100 USDT wagered</p>
          </div>
          <div className="p-4 bg-background rounded-lg border text-center">
            <h3 className="font-medium mb-2">2. Level Up</h3>
            <p className="text-sm text-muted-foreground">Accumulate points to climb VIP tiers</p>
          </div>
          <div className="p-4 bg-background rounded-lg border text-center">
            <h3 className="font-medium mb-2">3. Enjoy Benefits</h3>
            <p className="text-sm text-muted-foreground">Unlock exclusive rewards and perks</p>
          </div>
        </div>
        <div className="text-center">
          <Button size="lg">
            Start Your VIP Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VIPProgram; 