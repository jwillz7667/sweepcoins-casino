import { FC } from "react";

const PrivacyPolicy: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
          <p>At SweepCoins Casino, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.1. Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information</li>
            <li>Date of birth</li>
            <li>Government-issued identification</li>
            <li>Cryptocurrency wallet addresses</li>
            <li>Transaction history</li>
            <li>Gaming activity and preferences</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.2. Technical Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Operating system</li>
            <li>Access times and dates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our services</li>
            <li>To verify your identity and prevent fraud</li>
            <li>To comply with legal and regulatory requirements</li>
            <li>To improve our Platform and user experience</li>
            <li>To communicate with you about our services</li>
            <li>To provide customer support</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Service providers and business partners</li>
            <li>Law enforcement agencies when required</li>
            <li>Regulatory bodies for compliance purposes</li>
            <li>Financial institutions for transaction processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your information, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of sensitive data</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Secure data storage and transmission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
            <li>Receive a copy of your information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">7. Cookies and Tracking</h2>
          <p>We use cookies and similar tracking technologies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Remember your preferences</li>
            <li>Analyze Platform usage</li>
            <li>Enhance security</li>
            <li>Improve user experience</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">8. Children's Privacy</h2>
          <p>Our Platform is not intended for individuals under 18 years of age. We do not knowingly collect information from children.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">9. Changes to Privacy Policy</h2>
          <p>We may update this Privacy Policy periodically. We will notify you of any material changes through the Platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">10. Contact Us</h2>
          <p>For privacy-related inquiries, please contact our Data Protection Officer at privacy@sweepcoins.com</p>
        </section>

        <section className="pt-6">
          <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 