import { FC } from "react";

const KYCPolicy: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">KYC Policy</h1>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
          <p>SweepCoins Casino is committed to preventing fraud and maintaining compliance with anti-money laundering (AML) regulations. Our Know Your Customer (KYC) policy is designed to verify the identity of our users and ensure the security of our platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">2. KYC Requirements</h2>
          <p>All users must complete our KYC verification process, which includes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Basic personal information verification</li>
            <li>Identity document verification</li>
            <li>Proof of address verification</li>
            <li>Source of funds verification (for certain transaction levels)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">3. Required Documents</h2>
          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.1. Proof of Identity</h3>
          <p>One of the following valid government-issued documents:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Passport</li>
            <li>National ID card</li>
            <li>Driver's license</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.2. Proof of Address</h3>
          <p>A recent document (not older than 3 months) showing your name and address:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Utility bill (electricity, water, gas)</li>
            <li>Bank statement</li>
            <li>Government-issued document</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">4. Verification Process</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Submit required documents through our secure platform</li>
            <li>Documents are reviewed by our compliance team</li>
            <li>Additional information may be requested if needed</li>
            <li>Verification status is updated within 24-48 hours</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">5. Verification Levels</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Level 1 - Basic</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email verification</li>
                <li>Phone number verification</li>
                <li>Basic personal information</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Level 2 - Standard</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>ID verification</li>
                <li>Proof of address</li>
                <li>Higher transaction limits</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Level 3 - Enhanced</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Source of funds verification</li>
                <li>Video verification</li>
                <li>Highest transaction limits</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">6. Data Protection</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All submitted documents are encrypted and stored securely</li>
            <li>Access to KYC information is strictly limited to authorized personnel</li>
            <li>Documents are retained only as long as required by law</li>
            <li>Users can request deletion of their data subject to legal requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">7. Compliance</h2>
          <p>Our KYC policy complies with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Anti-Money Laundering (AML) regulations</li>
            <li>Counter-Terrorist Financing (CTF) requirements</li>
            <li>Local and international gaming regulations</li>
            <li>Data protection and privacy laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">8. Contact</h2>
          <p>For KYC-related inquiries, please contact our compliance team at compliance@sweepcoins.com</p>
        </section>

        <section className="pt-6">
          <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  );
};

export default KYCPolicy; 