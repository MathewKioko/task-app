import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        "flex h-10 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm shadow-xs",
        "placeholder:text-neutral-400 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900",
        "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50 dark:disabled:bg-neutral-850",
        "hover:border-neutral-300 dark:hover:border-neutral-600",
        error
          ? "border-error focus-visible:ring-error/20"
          : "border-neutral-200 dark:border-neutral-700",
        className,
      )}
      {...props}
    />
  );
  },
);

Input.displayName = "Input";
