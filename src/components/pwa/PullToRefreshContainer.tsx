import React from "react";
import { RefreshCw } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

interface PullToRefreshContainerProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export const PullToRefreshContainer: React.FC<PullToRefreshContainerProps> = ({
  children,
  onRefresh,
  className = "",
}) => {
  const { containerRef, isRefreshing, pullDistance, pullProgress } =
    usePullToRefresh({
      onRefresh,
      threshold: 80,
    });

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto touch-pan-y ${className}`}
      style={{
        transform: `translateY(${pullDistance}px)`,
        transition: pullDistance === 0 ? "transform 0.2s ease-out" : "none",
      }}
    >
      {/* Pull indicator */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        style={{
          top: -40 + pullDistance,
          opacity: pullProgress,
          transform: `translateX(-50%) rotate(${pullProgress * 360}deg)`,
        }}
      >
        <div
          className={`p-2 rounded-full bg-primary/10 ${
            isRefreshing ? "animate-spin" : ""
          }`}
        >
          <RefreshCw className="h-5 w-5 text-primary" />
        </div>
      </div>

      {children}
    </div>
  );
};
