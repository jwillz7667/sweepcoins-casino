'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { paymentService } from '@/lib/payment-service';
import { type Transaction } from '@/types/transaction';

interface TransactionHistoryProps {
  userId: string;
}

export function TransactionHistory({ userId }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const userTransactions = await paymentService.getUserTransactions(userId);
        setTransactions(userTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [userId]);

  const handleDownloadReceipt = async (transactionId: string) => {
    try {
      const receipt = await paymentService.generateReceipt(transactionId);
      // Implementation for downloading receipt
      console.log('Downloading receipt:', receipt);
    } catch (error) {
      console.error('Failed to download receipt:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Transaction History</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: transaction.currency,
                  }).format(transaction.amount)}
                </TableCell>
                <TableCell className="capitalize">{transaction.method}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : transaction.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell>
                  {transaction.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadReceipt(transaction.id)}
                    >
                      Download
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 