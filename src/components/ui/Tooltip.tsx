import { type ReactNode, type HTMLAttributes, useState } from "react";
import { clsx } from "clsx";

export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content"
> {
  content: ReactNode;
  children: ReactNode;
}

export const Tooltip = ({
  content,
  children,
  className,
  ...props
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {isVisible && (
        <div
          className={clsx(
            "absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap",
            "rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-lg",
            "dark:bg-neutral-700",
            className,
          )}
          role="tooltip"
        >
          {content}
          <div className="absolute left-1/2 top-full -translate-x-1/2">
            <div className="border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-700" />
          </div>
        </div>
      )}
    </div>
  );
};
