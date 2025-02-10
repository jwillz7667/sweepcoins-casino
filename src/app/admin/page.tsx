"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Award, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  pendingWins: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRevenue: 0,
    pendingWins: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch total users
        const { count: userCount } = await supabase
          .from("users")
          .select("*", { count: "exact" });

        // Fetch total revenue
        const { data: transactions } = await supabase
          .from("invoices")
          .select("amount")
          .eq("status", "settled");
        
        const totalRevenue = transactions?.reduce(
          (sum, tx) => sum + (tx.amount || 0),
          0
        ) || 0;

        // Fetch pending wins
        const { count: pendingWinsCount } = await supabase
          .from("wins")
          .select("*", { count: "exact" })
          .eq("status", "pending");

        // Fetch active users (users who have played in the last 24 hours)
        const { count: activeUsersCount } = await supabase
          .from("game_sessions")
          .select("*", { count: "exact" })
          .gte(
            "created_at",
            new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          );

        setStats({
          totalUsers: userCount || 0,
          totalRevenue,
          pendingWins: pendingWinsCount || 0,
          activeUsers: activeUsersCount || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Wins</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingWins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add more dashboard sections here */}
    </div>
  );
} 