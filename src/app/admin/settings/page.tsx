"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SystemSettings {
  maintenance_mode: boolean;
  registration_enabled: boolean;
  min_deposit_amount: number;
  max_deposit_amount: number;
  default_user_coins: number;
  max_daily_withdrawals: number;
  support_email: string;
  terms_url: string;
  privacy_url: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    maintenance_mode: false,
    registration_enabled: true,
    min_deposit_amount: 10,
    max_deposit_amount: 1000,
    default_user_coins: 100,
    max_daily_withdrawals: 3,
    support_email: "",
    terms_url: "",
    privacy_url: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .single();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateSetting(key: keyof SystemSettings, value: any) {
    try {
      const { error } = await supabase
        .from("system_settings")
        .update({ [key]: value })
        .eq("id", 1); // Assuming we have a single row for settings

      if (error) throw error;

      setSettings((prev) => ({ ...prev, [key]: value }));

      // Log the setting change
      await supabase.from("audit_logs").insert({
        action: "setting_updated",
        entity_type: "system_settings",
        entity_id: "1",
        details: {
          setting: key,
          old_value: settings[key],
          new_value: value,
        },
      });

      toast.success("Setting updated successfully");
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Settings</h1>
      </div>

      <div className="grid gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Control the overall system status and access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable to temporarily disable access to the platform
                </p>
              </div>
              <Switch
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) =>
                  updateSetting("maintenance_mode", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to register
                </p>
              </div>
              <Switch
                checked={settings.registration_enabled}
                onCheckedChange={(checked) =>
                  updateSetting("registration_enabled", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>
              Configure payment and transaction limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Deposit</Label>
                  <Input
                    type="number"
                    value={settings.min_deposit_amount}
                    onChange={(e) =>
                      updateSetting(
                        "min_deposit_amount",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Deposit</Label>
                  <Input
                    type="number"
                    value={settings.max_deposit_amount}
                    onChange={(e) =>
                      updateSetting(
                        "max_deposit_amount",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default User Coins</Label>
                  <Input
                    type="number"
                    value={settings.default_user_coins}
                    onChange={(e) =>
                      updateSetting(
                        "default_user_coins",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Daily Withdrawals</Label>
                  <Input
                    type="number"
                    value={settings.max_daily_withdrawals}
                    onChange={(e) =>
                      updateSetting(
                        "max_daily_withdrawals",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Support Settings</CardTitle>
            <CardDescription>Configure support and legal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input
                type="email"
                value={settings.support_email}
                onChange={(e) => updateSetting("support_email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Terms of Service URL</Label>
              <Input
                type="url"
                value={settings.terms_url}
                onChange={(e) => updateSetting("terms_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Privacy Policy URL</Label>
              <Input
                type="url"
                value={settings.privacy_url}
                onChange={(e) => updateSetting("privacy_url", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 