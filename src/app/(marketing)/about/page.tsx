import { Metadata } from 'next'
import { MarketingLayout } from '@/components/marketing/marketing-layout'

export const metadata: Metadata = {
  title: 'About Us | SweepCoins Casino',
  description: 'Learn more about SweepCoins Casino and our mission',
}

export default function AboutPage() {
  return (
    <MarketingLayout>
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold mb-8">About SweepCoins Casino</h1>
        
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="lead">
            SweepCoins Casino is a premier online gaming destination, offering a secure and entertaining platform for players worldwide.
          </p>

          <h2>Our Mission</h2>
          <p>
            We strive to provide the most engaging and fair gaming experience while maintaining the highest standards of security and responsible gaming.
          </p>

          <h2>Security First</h2>
          <p>
            Your security is our top priority. We employ state-of-the-art encryption and security measures to protect your data and transactions.
          </p>

          <h2>Fair Play</h2>
          <p>
            All our games are regularly audited by independent third parties to ensure fair play and random outcomes.
          </p>

          <h2>Responsible Gaming</h2>
          <p>
            We are committed to promoting responsible gaming practices and providing tools and resources to help our players maintain control over their gaming activities.
          </p>

          <h2>Customer Support</h2>
          <p>
            Our dedicated support team is available 24/7 to assist you with any questions or concerns you may have.
          </p>
        </div>
      </div>
    </MarketingLayout>
  )
} 