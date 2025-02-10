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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { createClient } from "@supabase/supabase-js";
import { Search, Filter } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id?: string;
  details: Record<string, any>;
  created_at: string;
  user_email?: string;
}

const actionColors: Record<string, string> = {
  created: "bg-green-100 text-green-800",
  updated: "bg-blue-100 text-blue-800",
  deleted: "bg-red-100 text-red-800",
  verified: "bg-purple-100 text-purple-800",
  rejected: "bg-orange-100 text-orange-800",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("");

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("audit_logs")
        .select(`
          *,
          users (email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedLogs = data.map((log) => ({
        ...log,
        user_email: log.users?.email,
      }));

      setLogs(formattedLogs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user_email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEntityType =
      entityTypeFilter === "" || log.entity_type === entityTypeFilter;

    const matchesAction = actionFilter === "" || log.action === actionFilter;

    return matchesSearch && matchesEntityType && matchesAction;
  });

  const uniqueEntityTypes = Array.from(
    new Set(logs.map((log) => log.entity_type))
  );
  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Entity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {uniqueEntityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Details</TableHead>
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
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(log.created_at), "PPp")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        actionColors[log.action.split("_")[1]] ||
                        "bg-gray-100 text-gray-800"
                      }
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{log.entity_type}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.entity_id}
                  </TableCell>
                  <TableCell>{log.user_email || "System"}</TableCell>
                  <TableCell>
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 