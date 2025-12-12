import React from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePWA } from "@/hooks/usePWA";

export const InstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, promptInstall, dismissInstallPrompt } = usePWA();

  // Don't show if already installed, not installable, or previously dismissed
  if (isInstalled || !isInstallable) return null;
  if (localStorage.getItem("pwa-install-dismissed") === "true") return null;

  return (
    <Card className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 shadow-lg border-primary/20 animate-fade-in bg-card">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm">Install Woo-Fur</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add to your home screen for quick access and offline features
            </p>
          </div>
          <button
            onClick={dismissInstallPrompt}
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
            onClick={dismissInstallPrompt}
          >
            Not now
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1"
            onClick={promptInstall}
          >
            <Download className="h-4 w-4" />
            Install
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
