import { FC } from "react";
import { Button } from "@/components/ui/button";

const ResponsibleGaming: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Responsible Gaming</h1>
      
      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Our Commitment</h2>
          <p>At SweepCoins Casino, we are committed to promoting responsible gaming and providing a safe, fair, and enjoyable environment for all our users. We believe in empowering our players with tools and information to maintain control over their gaming activities.</p>
        </section>

        <section className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Need Help?</h2>
          <p className="mb-4">If you or someone you know is struggling with problem gambling, help is available 24/7:</p>
          <div className="space-y-2">
            <Button className="w-full" variant="default">
              Contact Support
            </Button>
            <Button className="w-full" variant="outline">
              Self-Exclude Now
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Self-Assessment</h2>
          <p className="mb-4">Ask yourself these questions to evaluate your gaming habits:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Do you spend more time or money than you can afford on gaming?</li>
            <li>Do you chase losses or borrow money to gamble?</li>
            <li>Does gaming interfere with your work or relationships?</li>
            <li>Do you hide your gaming activity from others?</li>
            <li>Do you feel guilty about your gaming habits?</li>
          </ul>
          <p className="mt-4">If you answered "yes" to any of these questions, we encourage you to use our responsible gaming tools or seek professional help.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Our Responsible Gaming Tools</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">Deposit Limits</h3>
              <p>Set daily, weekly, or monthly limits on your deposits to maintain control over your spending.</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">Loss Limits</h3>
              <p>Establish maximum loss thresholds to prevent excessive losses within a specified timeframe.</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">Session Limits</h3>
              <p>Set time limits for your gaming sessions to maintain a healthy balance.</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">Self-Exclusion</h3>
              <p>Temporarily or permanently exclude yourself from our platform if needed.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Protecting Minors</h2>
          <p>We take the protection of minors seriously. It is illegal for anyone under 18 to use our platform. We:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Verify age during registration</li>
            <li>Implement strict KYC procedures</li>
            <li>Monitor accounts for suspicious activity</li>
            <li>Provide parental control information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Tips for Responsible Gaming</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Set a budget and stick to it</li>
            <li>Never chase losses</li>
            <li>Take regular breaks</li>
            <li>Don't game when stressed or depressed</li>
            <li>Keep gaming entertainment, not a source of income</li>
            <li>Balance gaming with other activities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Support Organizations</h2>
          <div className="space-y-4">
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">National Problem Gambling Helpline</h3>
              <p>24/7 Confidential Support</p>
              <p className="text-primary">1-800-522-4700</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="text-lg font-medium mb-2">Gamblers Anonymous</h3>
              <p>Find a Meeting Near You</p>
              <p className="text-primary">www.gamblersanonymous.org</p>
            </div>
          </div>
        </section>

        <section className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Contact Our Responsible Gaming Team</h2>
          <p className="mb-4">Our dedicated team is available 24/7 to assist you with:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Setting up responsible gaming tools</li>
            <li>Account restrictions</li>
            <li>Self-exclusion requests</li>
            <li>General support and guidance</li>
          </ul>
          <Button className="w-full">Contact Team</Button>
        </section>
      </div>
    </div>
  );
};

export default ResponsibleGaming; 