import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { faqs, categories } from "@/data/faq-data";

const FAQ: FC = () => {
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
              {faqs[category.id].map((faq, index) => (
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