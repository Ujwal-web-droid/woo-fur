import React, { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications, NotificationType } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";

interface NotificationSetting {
  key: keyof Omit<ReturnType<typeof useNotifications>["preferences"], "enabled">;
  label: string;
  description: string;
  type: NotificationType;
}

const notificationSettings: NotificationSetting[] = [
  {
    key: "sessionReminders",
    label: "Session Reminders",
    description: "Get notified 24 hours and 1 hour before your appointments",
    type: "session_reminder",
  },
  {
    key: "animalUpdates",
    label: "Animal Updates",
    description: "Updates about your favorite animals",
    type: "animal_update",
  },
  {
    key: "programAnnouncements",
    label: "Program Announcements",
    description: "New programs, events, and volunteer opportunities",
    type: "program_announcement",
  },
  {
    key: "donationImpact",
    label: "Donation Impact",
    description: "See how your donations are making a difference",
    type: "donation_impact",
  },
];

export const NotificationSettings: React.FC = () => {
  const {
    permission,
    preferences,
    isSupported,
    requestPermission,
    updatePreference,
  } = useNotifications();

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <BellOff className="h-5 w-5" />
            <p className="text-sm">Notifications are not supported on this device</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {permission === "denied" ? (
          <div className="p-4 bg-destructive/10 rounded-lg">
            <p className="text-sm text-destructive">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        ) : permission === "default" ? (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">
              Enable notifications to stay updated on appointments and animal news
            </p>
            <Button onClick={requestPermission} size="sm">
              Enable Notifications
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Enable All</p>
                <p className="text-sm text-muted-foreground">
                  Master switch for all notifications
                </p>
              </div>
              <Switch
                checked={preferences.enabled}
                onCheckedChange={(checked) => updatePreference("enabled", checked)}
              />
            </div>

            {preferences.enabled && (
              <div className="space-y-3 pt-2 border-t border-border">
                {notificationSettings.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {setting.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      checked={preferences[setting.key]}
                      onCheckedChange={(checked) =>
                        updatePreference(setting.key, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
