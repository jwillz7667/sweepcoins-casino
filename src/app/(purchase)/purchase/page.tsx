import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PurchaseOptions } from '@/components/purchase/PurchaseOptions'

export const metadata: Metadata = {
  title: 'Purchase Coins | SweepCoins Casino',
  description: 'Purchase gaming coins securely with multiple payment options',
}

export default async function PurchasePage() {
  const session = await auth()

  if (!session) {
    redirect('/auth')
  }

  return (
    <div className="container max-w-6xl py-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Purchase Coins</h1>
          <p className="text-muted-foreground">
            Select a package and payment method to purchase gaming coins.
          </p>
        </div>
        <PurchaseOptions />
      </div>
    </div>
  )
} 