import { forwardRef, type ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", className, children, ...props },
    ref,
  ) => {
  return (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900",
        "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-[0.98]",
        {
          "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow":
            variant === "primary",
          "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-50 dark:border-neutral-700":
            variant === "secondary",
          "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800":
            variant === "ghost",
          "bg-error text-white hover:bg-red-700 shadow-sm hover:shadow":
            variant === "destructive",
        },
        {
          "h-8 px-3 text-xs font-semibold": size === "sm",
          "h-10 px-4 text-sm font-semibold": size === "md",
          "h-11 px-6 text-sm font-semibold": size === "lg",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
  },
);

Button.displayName = "Button";
