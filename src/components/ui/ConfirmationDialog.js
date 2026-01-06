import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from "./Modal";
import { Button } from "./Button";
export const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", variant = "danger", className, ...props }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case "danger":
                return {
                    icon: "⚠️",
                    confirmColor: "destructive",
                    cancelColor: "secondary",
                };
            case "warning":
                return {
                    icon: "⚠️",
                    confirmColor: "secondary",
                    cancelColor: "ghost",
                };
            case "info":
                return {
                    icon: "ℹ️",
                    confirmColor: "primary",
                    cancelColor: "secondary",
                };
            default:
                return {
                    icon: "❓",
                    confirmColor: "primary",
                    cancelColor: "secondary",
                };
        }
    };
    const variantStyles = getVariantStyles();
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: title, className: className, ...props, children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "text-2xl mt-0.5", children: variantStyles.icon }), _jsx("div", { className: "flex-1", children: _jsx("p", { className: "text-sm text-neutral-600 dark:text-neutral-400", children: message }) })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4", children: [_jsx(Button, { type: "button", variant: variantStyles.cancelColor, onClick: onClose, children: cancelText }), _jsx(Button, { type: "button", variant: variantStyles.confirmColor, onClick: () => {
                                onConfirm();
                                onClose();
                            }, children: confirmText })] })] }) }));
};
