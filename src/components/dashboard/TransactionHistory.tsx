import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/use-transactions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Coins } from "lucide-react";

export const TransactionHistory = () => {
  const { user } = useAuth();
  const { data: transactions, isLoading } = useTransactions(user?.id || "");

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium capitalize">
                {transaction.type.replace("_", " ")}
              </TableCell>
              <TableCell className={transaction.amount >= 0 ? "text-green-600" : "text-red-600"}>
                {transaction.amount >= 0 ? "+" : ""}{transaction.amount}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-accent" />
                  {transaction.balance_after}
                </div>
              </TableCell>
              <TableCell>{(transaction.metadata as { description?: string })?.description || "-"}</TableCell>
              <TableCell>
                {format(new Date(transaction.created_at), "MMM d, yyyy HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};