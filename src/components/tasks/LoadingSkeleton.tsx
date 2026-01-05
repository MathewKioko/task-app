import { type HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface LoadingSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  count?: number;
}

export const LoadingSkeleton = ({
  count = 5,
  className,
  ...props
}: LoadingSkeletonProps) => {
  return (
    <div
      className={clsx(
        "space-y-3 p-6",
        className,
      )}
      {...props}
      role="status"
      aria-label="Loading tasks"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 shadow-xs"
        >
          {/* Checkbox skeleton */}
          <div className="h-[18px] w-[18px] shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />

          {/* Content skeleton */}
          <div className="flex flex-1 flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <div className="h-4 rounded-md bg-neutral-100 dark:bg-neutral-800 animate-pulse" style={{ width: `${Math.random() * 200 + 150}px` }} />
              <div className="h-5 w-16 shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-3 w-20 rounded-md bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-3 w-24 rounded-md bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center gap-0.5">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-8 w-8 shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
