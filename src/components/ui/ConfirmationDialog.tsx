import { type HTMLAttributes } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface ConfirmationDialogProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  className,
  ...props
}: ConfirmationDialogProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "⚠️",
          confirmColor: "destructive" as const,
          cancelColor: "secondary" as const,
        };
      case "warning":
        return {
          icon: "⚠️",
          confirmColor: "secondary" as const,
          cancelColor: "ghost" as const,
        };
      case "info":
        return {
          icon: "ℹ️",
          confirmColor: "primary" as const,
          cancelColor: "secondary" as const,
        };
      default:
        return {
          icon: "❓",
          confirmColor: "primary" as const,
          cancelColor: "secondary" as const,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className={className}
      {...props}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-0.5">
            {variantStyles.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant={variantStyles.cancelColor}
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variantStyles.confirmColor}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};