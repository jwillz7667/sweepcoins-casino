import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Support: FC = () => {
  const supportCategories = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: "💬",
      available: "24/7",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: "📧",
      available: "Response within 24h",
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      icon: "📞",
      available: "24/7",
    },
    {
      title: "Help Center",
      description: "Browse our knowledge base",
      icon: "📚",
      available: "Self-service",
    },
  ];

  const commonIssues = [
    "Account Access",
    "Deposits & Withdrawals",
    "Game Issues",
    "Technical Problems",
    "Bonus & Promotions",
    "Verification Process",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4">24/7 Support</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Our dedicated support team is here to help you with any questions or concerns. Choose your preferred method of contact below.
        </p>
      </div>

      {/* Support Options */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {supportCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                {category.title}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Available: {category.available}
              </p>
              <Button className="w-full">
                {category.title === "Help Center" ? "Browse Articles" : "Contact Now"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Issue Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonIssues.map((issue) => (
                      <SelectItem key={issue} value={issue.toLowerCase().replace(/\s+/g, '-')}>
                        {issue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Describe your issue in detail..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">
                  Send Message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Quick Help</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Password Reset</CardTitle>
              <CardDescription>
                Forgot your password? Reset it securely here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Reset Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Verification</CardTitle>
              <CardDescription>
                Complete your KYC verification process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Verify Account
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>
                Find answers to common questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View FAQ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support; 