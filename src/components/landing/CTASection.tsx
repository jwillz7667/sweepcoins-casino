import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Ready to Start Your Gaming Journey?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Join our community of players and experience the thrill of winning today.
          </p>
          <Link to="/auth">
            <Button size="lg" className="neo-blur">
              Create Your Account
              <span aria-hidden="true">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};