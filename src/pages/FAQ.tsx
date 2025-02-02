import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FAQ: FC = () => {
  const faqs = {
    general: [
      {
        question: "What is SweepCoins Casino?",
        answer: "SweepCoins Casino is a cutting-edge online gaming platform that combines traditional casino games with blockchain technology. We offer a wide range of games, secure transactions, and provably fair gaming experience.",
      },
      {
        question: "Is SweepCoins Casino legal?",
        answer: "Yes, SweepCoins Casino operates under all applicable gaming regulations and holds necessary licenses. We maintain strict compliance with international gaming laws and anti-money laundering regulations.",
      },
      {
        question: "How do I create an account?",
        answer: "Creating an account is simple! Click the 'Sign Up' button, provide your email address, create a secure password, and complete the verification process. You'll be ready to play in minutes.",
      },
    ],
    deposits: [
      {
        question: "What cryptocurrencies do you accept?",
        answer: "We accept Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), and various other popular cryptocurrencies. Check our deposits page for a complete list of supported currencies.",
      },
      {
        question: "How long do deposits take?",
        answer: "Cryptocurrency deposits are typically credited to your account within 10-30 minutes, depending on network congestion. Some currencies may require additional confirmations for security.",
      },
      {
        question: "Is there a minimum deposit amount?",
        answer: "Yes, minimum deposit amounts vary by cryptocurrency. Please check our deposits page for specific minimums for each currency.",
      },
    ],
    withdrawals: [
      {
        question: "How do I withdraw my winnings?",
        answer: "Go to the cashier section, select 'Withdraw', choose your preferred cryptocurrency, enter the amount and your wallet address. Withdrawals are processed automatically for verified accounts.",
      },
      {
        question: "What are the withdrawal limits?",
        answer: "Withdrawal limits vary based on your VIP level. Basic accounts can withdraw up to 5,000 USDT per day, while higher VIP levels enjoy increased limits.",
      },
      {
        question: "How long do withdrawals take?",
        answer: "Most withdrawals are processed within 24 hours. VIP members enjoy faster processing times. Actual receipt of funds depends on blockchain network conditions.",
      },
    ],
    security: [
      {
        question: "How do you protect my account?",
        answer: "We employ industry-leading security measures including 2FA, SSL encryption, cold storage for funds, and regular security audits. We recommend enabling all security features in your account settings.",
      },
      {
        question: "What is your KYC policy?",
        answer: "We require KYC verification for withdrawals above certain thresholds. This helps prevent fraud and ensure compliance with regulations. The process typically takes 24-48 hours to complete.",
      },
      {
        question: "How do I enable 2FA?",
        answer: "Go to your account security settings, select 'Enable 2FA', and follow the instructions to set up Google Authenticator or another supported 2FA app.",
      },
    ],
    gaming: [
      {
        question: "Are your games fair?",
        answer: "Yes, all our games use provably fair technology. You can verify the fairness of each game result using our verification tool. We also undergo regular third-party audits.",
      },
      {
        question: "What games do you offer?",
        answer: "We offer a wide variety of games including slots, table games (blackjack, roulette, baccarat), poker, and instant win games. Our game selection is constantly expanding.",
      },
      {
        question: "Can I play on mobile?",
        answer: "Yes, our platform is fully mobile-responsive. You can play all our games on any modern smartphone or tablet through your web browser.",
      },
    ],
  };

  const categories = [
    { id: "general", name: "General" },
    { id: "deposits", name: "Deposits" },
    { id: "withdrawals", name: "Withdrawals" },
    { id: "security", name: "Security" },
    { id: "gaming", name: "Gaming" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-8">
          Find answers to common questions about SweepCoins Casino. Can't find what you're looking for? Contact our support team.
        </p>
        
        {/* Search Bar */}
        <div className="w-full max-w-md">
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search FAQ..."
              className="w-full"
            />
            <Button>
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="grid gap-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs[category.id as keyof typeof faqs].map((faq, index) => (
                <AccordionItem key={index} value={`${category.id}-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="mt-12 bg-card rounded-lg p-8 border text-center">
        <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
        <p className="text-muted-foreground mb-6">
          Our support team is available 24/7 to help you with any questions or concerns.
        </p>
        <Button size="lg">
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default FAQ; 