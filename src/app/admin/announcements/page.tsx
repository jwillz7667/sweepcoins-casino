"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { createClient } from "@supabase/supabase-js";
import { Megaphone, Trash2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "error";
  status: "draft" | "published" | "archived";
  created_at: string;
  published_at?: string;
  expires_at?: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<Announcement["type"]>("info");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateAnnouncement(status: "draft" | "published") {
    try {
      const { error } = await supabase.from("announcements").insert({
        title,
        content,
        type,
        status,
        expires_at: expiresAt || null,
        published_at: status === "published" ? new Date().toISOString() : null,
      });

      if (error) throw error;

      // Log the action
      await supabase.from("audit_logs").insert({
        action: "announcement_created",
        entity_type: "announcement",
        details: {
          title,
          type,
          status,
        },
      });

      setTitle("");
      setContent("");
      setType("info");
      setExpiresAt("");
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  }

  async function handleUpdateStatus(id: string, status: Announcement["status"]) {
    try {
      const { error } = await supabase
        .from("announcements")
        .update({
          status,
          published_at:
            status === "published" ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Announcements</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
          <CardDescription>
            Create a new announcement to display to users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Announcement content..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Expires At</label>
              <Input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => handleCreateAnnouncement("draft")}
          >
            Save as Draft
          </Button>
          <Button onClick={() => handleCreateAnnouncement("published")}>
            Publish
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center">Loading...</CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Megaphone className="h-5 w-5" />
                    <span>{announcement.title}</span>
                  </CardTitle>
                  <CardDescription>
                    Created {format(new Date(announcement.created_at), "PPp")}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      announcement.status === "published"
                        ? "success"
                        : announcement.status === "archived"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {announcement.status}
                  </Badge>
                  <Badge variant="outline">{announcement.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{announcement.content}</p>
                {announcement.expires_at && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Expires: {format(new Date(announcement.expires_at), "PPp")}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                {announcement.status === "draft" && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUpdateStatus(announcement.id, "published")
                    }
                  >
                    Publish
                  </Button>
                )}
                {announcement.status === "published" && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUpdateStatus(announcement.id, "archived")
                    }
                  >
                    Archive
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(announcement.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 