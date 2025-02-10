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
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Win {
  id: string;
  user_id: string;
  game_id: string;
  amount: number;
  created_at: string;
  status: "pending" | "verified" | "rejected";
  verification_note?: string;
  user_email?: string;
  game_name?: string;
}

export default function WinsPage() {
  const [wins, setWins] = useState<Win[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWin, setSelectedWin] = useState<Win | null>(null);
  const [verificationNote, setVerificationNote] = useState("");

  useEffect(() => {
    fetchWins();
  }, []);

  async function fetchWins() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("wins")
        .select(`
          *,
          users (email),
          games (name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedWins = data.map(win => ({
        ...win,
        user_email: win.users?.email,
        game_name: win.games?.name
      }));

      setWins(formattedWins);
    } catch (error) {
      console.error("Error fetching wins:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyWin(win: Win, isApproved: boolean) {
    try {
      const { error } = await supabase
        .from("wins")
        .update({
          status: isApproved ? "verified" : "rejected",
          verification_note: verificationNote,
          verified_at: new Date().toISOString(),
        })
        .eq("id", win.id);

      if (error) throw error;

      // If approved, credit the user's account
      if (isApproved) {
        const { error: creditError } = await supabase.rpc("add_user_coins", {
          user_id: win.user_id,
          coins_amount: win.amount
        });

        if (creditError) throw creditError;
      }

      // Log the verification action
      await supabase.from("audit_logs").insert({
        action: isApproved ? "win_verified" : "win_rejected",
        entity_type: "win",
        entity_id: win.id,
        details: {
          amount: win.amount,
          user_id: win.user_id,
          note: verificationNote
        }
      });

      setSelectedWin(null);
      setVerificationNote("");
      await fetchWins();
    } catch (error) {
      console.error("Error verifying win:", error);
    }
  }

  const filteredWins = wins.filter(
    (win) =>
      win.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      win.game_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wins Verification</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or game..."
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
              <TableHead>Game</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
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
              filteredWins.map((win) => (
                <TableRow key={win.id}>
                  <TableCell>{win.user_email}</TableCell>
                  <TableCell>{win.game_name}</TableCell>
                  <TableCell>{win.amount} coins</TableCell>
                  <TableCell>
                    {new Date(win.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        win.status === "verified"
                          ? "success"
                          : win.status === "rejected"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {win.status.charAt(0).toUpperCase() + win.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {win.status === "pending" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedWin(win)}
                      >
                        Verify
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedWin(win)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedWin} onOpenChange={() => setSelectedWin(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Win</DialogTitle>
            <DialogDescription>
              Review and verify the winning claim
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">User</label>
                <p>{selectedWin?.user_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Game</label>
                <p>{selectedWin?.game_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <p>{selectedWin?.amount} coins</p>
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <p>
                  {selectedWin?.created_at &&
                    new Date(selectedWin.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Note</label>
              <Input
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                placeholder="Add a note about this verification..."
              />
            </div>

            {selectedWin?.status === "pending" && (
              <div className="flex justify-end space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => handleVerifyWin(selectedWin, false)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleVerifyWin(selectedWin, true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 