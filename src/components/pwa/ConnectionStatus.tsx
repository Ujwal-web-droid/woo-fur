import React from "react";
import { Wifi, WifiOff } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

interface ConnectionStatusProps {
  showWhenOnline?: boolean;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  showWhenOnline = false,
  className = "",
}) => {
  const { isOnline } = usePWA();

  if (isOnline && !showWhenOnline) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        isOnline
          ? "text-green-600"
          : "text-amber-600"
      } ${className}`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
};
