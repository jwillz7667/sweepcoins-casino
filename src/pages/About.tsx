import { FC } from "react";
import { Button } from "@/components/ui/button";

const About: FC = () => {
  const stats = [
    {
      value: "500K+",
      label: "Active Players",
    },
    {
      value: "$100M+",
      label: "Monthly Payouts",
    },
    {
      value: "99.9%",
      label: "Uptime",
    },
    {
      value: "24/7",
      label: "Support",
    },
  ];

  const values = [
    {
      title: "Fair Play",
      description: "We ensure all games are provably fair and transparent, with verified random number generation.",
    },
    {
      title: "Security",
      description: "State-of-the-art encryption and security measures to protect your assets and data.",
    },
    {
      title: "Innovation",
      description: "Constantly evolving our platform with the latest technology and gaming experiences.",
    },
    {
      title: "Community",
      description: "Building a vibrant, engaged gaming community with regular events and interactions.",
    },
    {
      title: "Responsibility",
      description: "Promoting responsible gaming practices and providing tools for player protection.",
    },
    {
      title: "Compliance",
      description: "Operating in full compliance with international gaming regulations and standards.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About SweepCoins Casino</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Welcome to the future of online gaming. SweepCoins Casino combines cutting-edge blockchain technology with classic casino entertainment to deliver an unparalleled gaming experience.
        </p>
        <Button size="lg">
          Start Playing
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold mb-2">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Mission Statement */}
      <div className="bg-card rounded-lg p-8 border mb-16">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-muted-foreground">
          To revolutionize the online gaming industry by providing a secure, transparent, and entertaining platform that combines the best of traditional casino games with cutting-edge blockchain technology. We strive to create an inclusive gaming environment where players from around the world can enjoy fair play and exciting rewards.
        </p>
      </div>

      {/* Core Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8">Our Core Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value) => (
            <div key={value.title} className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-medium mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className="bg-card rounded-lg p-8 border mb-16">
        <h2 className="text-2xl font-semibold mb-6">Powered by Technology</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-background rounded-lg border">
            <h3 className="font-medium mb-2">Blockchain Integration</h3>
            <p className="text-sm text-muted-foreground">
              Secure transactions and transparent gaming through blockchain technology.
            </p>
          </div>
          <div className="p-4 bg-background rounded-lg border">
            <h3 className="font-medium mb-2">Provably Fair</h3>
            <p className="text-sm text-muted-foreground">
              Verifiable random number generation for all games.
            </p>
          </div>
          <div className="p-4 bg-background rounded-lg border">
            <h3 className="font-medium mb-2">Smart Contracts</h3>
            <p className="text-sm text-muted-foreground">
              Automated payouts and transparent gaming logic.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-card rounded-lg p-8 border">
        <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
        <p className="text-muted-foreground mb-6">
          Be part of the next generation of online gaming. Join thousands of players worldwide on SweepCoins Casino.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="default">
            Create Account
          </Button>
          <Button variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About; 