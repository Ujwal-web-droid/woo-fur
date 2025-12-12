import { useState, useEffect, useCallback } from "react";

export type NotificationType =
  | "session_reminder"
  | "animal_update"
  | "program_announcement"
  | "donation_impact";

interface NotificationPreferences {
  enabled: boolean;
  sessionReminders: boolean;
  animalUpdates: boolean;
  programAnnouncements: boolean;
  donationImpact: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: false,
  sessionReminders: true,
  animalUpdates: true,
  programAnnouncements: true,
  donationImpact: true,
};

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    const stored = localStorage.getItem("notification-preferences");
    return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    localStorage.setItem("notification-preferences", JSON.stringify(preferences));
  }, [preferences]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof Notification === "undefined") {
      console.warn("Notifications not supported");
      return false;
    }

    if (permission === "granted") {
      setPreferences((prev) => ({ ...prev, enabled: true }));
      return true;
    }

    if (permission === "denied") {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        setPreferences((prev) => ({ ...prev, enabled: true }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [permission]);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions & { type?: NotificationType }) => {
      if (permission !== "granted" || !preferences.enabled) return null;

      // Check type-specific preferences
      if (options?.type) {
        switch (options.type) {
          case "session_reminder":
            if (!preferences.sessionReminders) return null;
            break;
          case "animal_update":
            if (!preferences.animalUpdates) return null;
            break;
          case "program_announcement":
            if (!preferences.programAnnouncements) return null;
            break;
          case "donation_impact":
            if (!preferences.donationImpact) return null;
            break;
        }
      }

      const notification = new Notification(title, {
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        ...options,
      });

      return notification;
    },
    [permission, preferences]
  );

  const updatePreference = useCallback(
    (key: keyof NotificationPreferences, value: boolean) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const scheduleNotification = useCallback(
    (title: string, options: NotificationOptions & { delay: number; type?: NotificationType }) => {
      const { delay, ...notificationOptions } = options;
      
      const timeoutId = setTimeout(() => {
        showNotification(title, notificationOptions);
      }, delay);

      return () => clearTimeout(timeoutId);
    },
    [showNotification]
  );

  return {
    permission,
    preferences,
    isSupported: typeof Notification !== "undefined",
    requestPermission,
    showNotification,
    updatePreference,
    scheduleNotification,
  };
};
