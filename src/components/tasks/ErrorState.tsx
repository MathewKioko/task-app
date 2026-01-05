import { type HTMLAttributes } from "react";
import { clsx } from "clsx";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = "Something went wrong",
  message = "Please try again later",
  onRetry,
  className,
  ...props
}: ErrorStateProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
      role="alert"
      {...props}
    >
      <div className="rounded-xl bg-red-100 p-6 dark:bg-red-900/30">
        <AlertCircle className="h-12 w-12 text-error" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        {title}
      </h3>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" className="mt-6">
          Try Again
        </Button>
      )}
    </div>
  );
};
