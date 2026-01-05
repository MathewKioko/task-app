import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          className={clsx(
            "peer h-[18px] w-[18px] shrink-0 appearance-none rounded-lg border-2 transition-all duration-200 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "hover:border-neutral-400 dark:hover:border-neutral-500",
            "checked:bg-primary checked:border-primary checked:hover:bg-primary-hover checked:hover:border-primary-hover",
            "dark:border-neutral-600 dark:checked:bg-primary dark:checked:border-primary",
            "shadow-xs",
            checked ? "bg-primary border-primary" : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600",
            className,
          )}
          {...props}
        />
        {checked && (
          <Check
            className="pointer-events-none absolute left-0.5 top-0.5 h-3.5 w-3.5 text-white animate-in zoom-in-50 duration-150"
            strokeWidth={2.5}
          />
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
