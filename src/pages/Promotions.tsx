import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Promotions: FC = () => {
  const promotions = [
    {
      id: 1,
      title: "Welcome Bonus",
      description: "Get up to 500 USDT + 100 Free Spins on your first deposit",
      type: "new-players",
      endDate: "2024-12-31",
      terms: [
        "Minimum deposit: 50 USDT",
        "40x wagering requirement",
        "Valid for 30 days",
        "Free spins on selected slots only",
      ],
    },
    {
      id: 2,
      title: "Crypto Reload Bonus",
      description: "50% bonus up to 200 USDT on all crypto deposits",
      type: "reload",
      endDate: "2024-12-31",
      terms: [
        "Minimum deposit: 100 USDT",
        "35x wagering requirement",
        "Valid for 14 days",
      ],
    },
    {
      id: 3,
      title: "Weekend Cashback",
      description: "Get 10% cashback on all weekend losses",
      type: "cashback",
      endDate: "2024-12-31",
      terms: [
        "Minimum loss: 500 USDT",
        "No wagering requirement",
        "Paid every Monday",
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Promotions</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Take advantage of our exciting promotions and boost your gaming experience with exclusive bonuses and rewards.
        </p>
      </div>

      <div className="grid gap-8">
        {promotions.map((promo) => (
          <div key={promo.id} className="bg-card rounded-lg p-6 border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-semibold">{promo.title}</h2>
                  <Badge variant="secondary">{promo.type}</Badge>
                </div>
                <p className="text-muted-foreground">{promo.description}</p>
              </div>
              <Button className="mt-4 md:mt-0">
                Claim Now
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Terms & Conditions:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {promo.terms.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
              Valid until: {new Date(promo.endDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <div className="bg-card rounded-lg p-8 border">
          <h2 className="text-2xl font-semibold mb-6">VIP Program Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-medium mb-2">Silver</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 5% Weekly Cashback</li>
                <li>• Dedicated Account Manager</li>
                <li>• Higher Withdrawal Limits</li>
              </ul>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-medium mb-2">Gold</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 10% Weekly Cashback</li>
                <li>• Premium Account Manager</li>
                <li>• Custom Bonuses</li>
              </ul>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="font-medium mb-2">Platinum</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 15% Weekly Cashback</li>
                <li>• VIP Events & Gifts</li>
                <li>• Unlimited Withdrawals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotions; 