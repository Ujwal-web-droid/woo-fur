import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Global deferred prompt variable
let deferredPrompt: BeforeInstallPromptEvent | null = null;

const STORAGE_KEYS = {
  CAN_INSTALL: "pwa_can_install",
  INSTALLED: "pwa_installed",
  DISMISSED: "pwa_install_dismissed",
};

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
}

export const usePWA = () => {
  const [state, setState] = useState<PWAState>({
    isInstallable: localStorage.getItem(STORAGE_KEYS.CAN_INSTALL) === "yes",
    isInstalled: localStorage.getItem(STORAGE_KEYS.INSTALLED) === "yes",
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
  });

  useEffect(() => {
    // Check if already installed via display mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      localStorage.setItem(STORAGE_KEYS.INSTALLED, "yes");
      localStorage.setItem(STORAGE_KEYS.CAN_INSTALL, "no");
      setState((prev) => ({ ...prev, isInstalled: true, isInstallable: false }));
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      localStorage.setItem(STORAGE_KEYS.CAN_INSTALL, "yes");
      setState((prev) => ({
        ...prev,
        isInstallable: true,
      }));
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      deferredPrompt = null;
      localStorage.setItem(STORAGE_KEYS.INSTALLED, "yes");
      localStorage.setItem(STORAGE_KEYS.CAN_INSTALL, "no");
      setState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
      }));
    };

    // Listen for online/offline
    const handleOnline = () => {
      setState((prev) => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setState((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        deferredPrompt = null;
        localStorage.setItem(STORAGE_KEYS.INSTALLED, "yes");
        localStorage.setItem(STORAGE_KEYS.CAN_INSTALL, "no");
        setState((prev) => ({
          ...prev,
          isInstallable: false,
          isInstalled: true,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error prompting install:", error);
      return false;
    }
  }, []);

  const dismissInstallPrompt = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.DISMISSED, "true");
  }, []);

  const isDismissed = localStorage.getItem(STORAGE_KEYS.DISMISSED) === "true";

  return {
    ...state,
    promptInstall,
    dismissInstallPrompt,
    isDismissed,
  };
};
