"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, RefreshCcw } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  payment_method: string;
  user_email?: string;
  metadata?: Record<string, any>;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refundNote, setRefundNote] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          users (email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedTransactions = data.map(tx => ({
        ...tx,
        user_email: tx.users?.email
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefund(transaction: Transaction) {
    try {
      // Create refund record
      const { error: refundError } = await supabase
        .from("refunds")
        .insert({
          invoice_id: transaction.id,
          amount: transaction.amount,
          reason: refundNote,
          status: "pending"
        });

      if (refundError) throw refundError;

      // Update transaction status
      const { error: updateError } = await supabase
        .from("invoices")
        .update({ status: "refunded" })
        .eq("id", transaction.id);

      if (updateError) throw updateError;

      // Deduct coins from user
      const { error: deductError } = await supabase.rpc("adjust_user_coins", {
        user_id: transaction.user_id,
        coins_amount: -transaction.amount
      });

      if (deductError) throw deductError;

      // Log the refund action
      await supabase.from("audit_logs").insert({
        action: "transaction_refunded",
        entity_type: "transaction",
        entity_id: transaction.id,
        details: {
          amount: transaction.amount,
          user_id: transaction.user_id,
          reason: refundNote
        }
      });

      setSelectedTransaction(null);
      setRefundNote("");
      await fetchTransactions();
    } catch (error) {
      console.error("Error processing refund:", error);
    }
  }

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.user_email}</TableCell>
                  <TableCell>
                    {tx.amount} {tx.currency}
                  </TableCell>
                  <TableCell className="capitalize">{tx.payment_method}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.status === "settled"
                          ? "success"
                          : tx.status === "refunded"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(tx.created_at), "PPp")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTransaction(tx)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {tx.status === "settled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTransaction(tx)}
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedTransaction}
        onOpenChange={() => setSelectedTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              View transaction details and process refunds
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Transaction ID</label>
                <p className="font-mono text-sm">{selectedTransaction?.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium">User</label>
                <p>{selectedTransaction?.user_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <p>
                  {selectedTransaction?.amount} {selectedTransaction?.currency}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <p className="capitalize">{selectedTransaction?.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <p className="capitalize">{selectedTransaction?.payment_method}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <p>
                  {selectedTransaction?.created_at &&
                    format(new Date(selectedTransaction.created_at), "PPp")}
                </p>
              </div>
            </div>

            {selectedTransaction?.status === "settled" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Refund Note</label>
                  <Input
                    value={refundNote}
                    onChange={(e) => setRefundNote(e.target.value)}
                    placeholder="Add a note about this refund..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={() => handleRefund(selectedTransaction)}
                  >
                    Process Refund
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 