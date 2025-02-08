'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { paymentService } from '@/lib/payment-service';

interface PaymentAnalytics {
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  methodDistribution: Record<string, number>;
  recentTrends: {
    date: string;
    volume: number;
  }[];
}

interface PaymentAnalyticsProps {
  userId: string;
}

export function PaymentAnalytics({ userId }: PaymentAnalyticsProps) {
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateAnalytics = async () => {
      try {
        const transactions = await paymentService.getUserTransactions(userId);
        
        const totalTransactions = transactions.length;
        const completedTransactions = transactions.filter(
          (t) => t.status === 'completed'
        );
        
        const totalVolume = completedTransactions.reduce(
          (sum, t) => sum + t.amount,
          0
        );
        
        const successRate =
          totalTransactions > 0
            ? (completedTransactions.length / totalTransactions) * 100
            : 0;

        // Calculate method distribution
        const methodDistribution = transactions.reduce((acc, t) => {
          acc[t.method] = (acc[t.method] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Calculate recent trends (last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const recentTrends = last7Days.map((date) => {
          const dayTransactions = transactions.filter(
            (t) =>
              new Date(t.createdAt).toISOString().split('T')[0] === date &&
              t.status === 'completed'
          );
          
          return {
            date,
            volume: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
          };
        });

        setAnalytics({
          totalTransactions,
          totalVolume,
          successRate,
          methodDistribution,
          recentTrends,
        });
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateAnalytics();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Payment Analytics</h2>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold">{analytics.totalTransactions}</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Volume</p>
            <p className="text-2xl font-bold">
              ${analytics.totalVolume.toFixed(2)}
            </p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold">
              {analytics.successRate.toFixed(1)}%
            </p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Most Used Method</p>
            <p className="text-2xl font-bold capitalize">
              {Object.entries(analytics.methodDistribution).sort(
                ([, a], [, b]) => b - a
              )[0]?.[0] || 'N/A'}
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Recent Trends</h3>
        <div className="space-y-2">
          {analytics.recentTrends.map((trend) => (
            <div
              key={trend.date}
              className="flex items-center justify-between border-b py-2 last:border-0"
            >
              <span className="text-sm text-muted-foreground">
                {new Date(trend.date).toLocaleDateString()}
              </span>
              <span className="font-medium">${trend.volume.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Payment Methods</h3>
        <div className="space-y-2">
          {Object.entries(analytics.methodDistribution).map(([method, count]) => (
            <div
              key={method}
              className="flex items-center justify-between border-b py-2 last:border-0"
            >
              <span className="capitalize">{method}</span>
              <span className="font-medium">{count} transactions</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 