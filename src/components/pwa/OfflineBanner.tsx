import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export const OfflineBanner: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium animate-fade-in">
      <WifiOff className="h-4 w-4" />
      <span>You're offline. Some features may be limited.</span>
      <button
        onClick={() => window.location.reload()}
        className="ml-2 p-1 hover:bg-amber-600/20 rounded-full transition-colors"
        aria-label="Retry connection"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
};
