import { type HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar = ({
  src,
  alt,
  fallback,
  className,
  ...props
}: AvatarProps) => {
  return (
    <div
      className={clsx(
        "relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full",
        "bg-neutral-200 dark:bg-neutral-700",
        className,
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
          {fallback || "?"}
        </span>
      )}
    </div>
  );
};
