import React, { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const UpdatePrompt: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        // Check for updates
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setShowUpdate(true);
              }
            });
          }
        });
      });

      // Listen for controller change
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  };

  if (!showUpdate) return null;

  return (
    <Card className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 shadow-lg border-primary/20 animate-fade-in bg-card">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <RefreshCw className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm">Update Available</h3>
            <p className="text-xs text-muted-foreground mt-1">
              A new version of Woo-Fur is ready. Refresh to get the latest features!
            </p>
          </div>
          <button
            onClick={() => setShowUpdate(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setShowUpdate(false)}
          >
            Later
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1"
            onClick={handleUpdate}
          >
            <RefreshCw className="h-4 w-4" />
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
