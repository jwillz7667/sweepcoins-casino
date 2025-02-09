'use client';

import { useAuth } from "@/hooks/use-auth";
import { PurchaseOptions } from "@/components/purchase/PurchaseOptions";
import { Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Purchase() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a successful payment redirect
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const invoiceId = params.get('invoiceId');

    if (success === 'true' && invoiceId) {
      navigate(`/purchase/success?invoiceId=${invoiceId}`, { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Purchase Game Coins
              </h1>
              <p className="text-muted-foreground">
                Select a package to get started with your gaming journey
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
              <Coins className="h-5 w-5 text-yellow-500" />
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="font-medium">{user?.sweepcoins?.toLocaleString() || 0} GC</span>
              </div>
            </div>
          </div>

          <PurchaseOptions />

          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              * All purchases are final and non-refundable. By making a purchase, you agree to our{' '}
              <a href="/terms" className="underline hover:text-primary">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}