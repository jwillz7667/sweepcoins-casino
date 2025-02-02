import { FC } from "react";

const TermsAndConditions: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
          <p>Welcome to SweepCoins Casino. These terms and conditions outline the rules and regulations for the use of our Platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Definitions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>"Platform" refers to SweepCoins Casino website and services</li>
            <li>"User," "You," and "Your" refers to you, the person accessing this Platform</li>
            <li>"Company," "We," "Our," and "Us" refers to SweepCoins Casino</li>
            <li>"Party" refers to either you or us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Account Registration</h2>
          <p>3.1. Age Requirement: You must be at least 18 years old to use our services.</p>
          <p>3.2. Account Information: You must provide accurate, current, and complete information during registration.</p>
          <p>3.3. Account Security: You are responsible for maintaining the confidentiality of your account credentials.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Platform Rules</h2>
          <p>4.1. Fair Play: Users must not engage in any form of cheating or manipulation.</p>
          <p>4.2. Multiple Accounts: Users are not permitted to maintain multiple accounts.</p>
          <p>4.3. Prohibited Activities: Users must not engage in money laundering or other illegal activities.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Digital Assets</h2>
          <p>5.1. Cryptocurrency transactions are final and irreversible.</p>
          <p>5.2. Users are responsible for providing correct wallet addresses.</p>
          <p>5.3. The platform is not responsible for losses due to user error.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">6. Responsible Gaming</h2>
          <p>6.1. We promote responsible gaming and provide tools to help users manage their gaming activity.</p>
          <p>6.2. Users can set deposit limits, loss limits, and self-exclusion periods.</p>
          <p>6.3. We reserve the right to close accounts showing signs of problem gambling.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">7. Intellectual Property</h2>
          <p>7.1. All content on the Platform is owned by SweepCoins Casino.</p>
          <p>7.2. Users may not copy, modify, or distribute our content without permission.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">8. Privacy</h2>
          <p>8.1. Our Privacy Policy explains how we collect and use your information.</p>
          <p>8.2. By using our Platform, you consent to our privacy practices.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">9. Termination</h2>
          <p>9.1. We reserve the right to terminate accounts for violations of these terms.</p>
          <p>9.2. Users may terminate their accounts at any time.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
          <p>10.1. We may modify these terms at any time.</p>
          <p>10.2. Continued use of the Platform constitutes acceptance of new terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">11. Contact Information</h2>
          <p>For questions about these terms, please contact us at support@sweepcoins.com</p>
        </section>

        <section className="pt-6">
          <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions; 