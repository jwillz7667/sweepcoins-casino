"use client";

import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { errorTracking } from "@/lib/error-tracking";
import {
  FaDiscord,
  FaTwitter,
  FaTelegram,
  FaInstagram,
  FaBitcoin,
  FaEthereum,
} from "react-icons/fa";
import { SiLitecoin, SiDogecoin } from "react-icons/si";

const Footer: FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Call newsletter subscription API
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to newsletter');
      }

      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      errorTracking.captureError(error, {
        context: { component: 'Footer', action: 'newsletter_subscribe' }
      });
      toast.error('Failed to subscribe to newsletter. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SweepCoins Casino</h3>
            <p className="text-sm text-muted-foreground">
              Experience the future of gaming with our innovative sweepcoins casino platform.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="Twitter">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="Discord">
                <FaDiscord className="h-5 w-5" />
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="Telegram">
                <FaTelegram className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/games" className="text-sm text-muted-foreground hover:text-primary">
                  Games
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="text-sm text-muted-foreground hover:text-primary">
                  Promotions
                </Link>
              </li>
              <li>
                <Link to="/vip" className="text-sm text-muted-foreground hover:text-primary">
                  VIP Program
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support & Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-primary">
                  24/7 Support
                </Link>
              </li>
              <li>
                <Link to="/responsible-gaming" className="text-sm text-muted-foreground hover:text-primary">
                  Responsible Gaming
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/kyc" className="text-sm text-muted-foreground hover:text-primary">
                  KYC Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to receive updates and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email for newsletter"
                disabled={isSubmitting}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        {/* Supported Cryptocurrencies */}
        <div className="mt-12 border-t pt-8">
          <h3 className="text-lg font-semibold mb-4">Supported Cryptocurrencies</h3>
          <div className="flex space-x-6">
            <FaBitcoin className="h-6 w-6" title="Bitcoin" />
            <FaEthereum className="h-6 w-6" title="Ethereum" />
            <SiLitecoin className="h-6 w-6" title="Litecoin" />
            <SiDogecoin className="h-6 w-6" title="Dogecoin" />
          </div>
        </div>

        {/* Responsible Gaming Notice */}
        <div className="mt-8 border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            🔞 Players must be 18 or over. Please play responsibly. Gambling can be addictive.
            For help, visit{" "}
            <Link to="/responsible-gaming" className="text-primary hover:underline">
              Responsible Gaming
            </Link>
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} SweepCoins Casino. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Licensed and regulated under applicable gaming regulations.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 