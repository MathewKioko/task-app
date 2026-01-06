import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
export const Dropdown = ({ options, value, onChange, placeholder = "Select...", error, className, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const selectedOption = options.find((opt) => opt.value === value);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    const handleSelect = (optionValue) => {
        onChange?.(optionValue);
        setIsOpen(false);
    };
    return (_jsxs("div", { ref: dropdownRef, className: clsx("relative", className), ...props, children: [_jsxs("button", { type: "button", onClick: () => setIsOpen(!isOpen), className: clsx("flex h-10 w-full items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-sm shadow-xs", "dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-700", "transition-all duration-200 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900", "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50 dark:disabled:bg-neutral-850", "hover:border-neutral-300 dark:hover:border-neutral-600", error
                    ? "border-error focus-visible:ring-error/20"
                    : "border-neutral-200"), "aria-haspopup": "listbox", "aria-expanded": isOpen, children: [_jsx("span", { className: clsx(selectedOption
                            ? "text-neutral-900 dark:text-neutral-50"
                            : "text-neutral-400 dark:text-neutral-500"), children: selectedOption?.label || placeholder }), _jsx(ChevronDown, { className: clsx("h-4 w-4 text-neutral-400 transition-transform duration-200", isOpen && "rotate-180") })] }), isOpen && (_jsx("div", { className: clsx("absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-white shadow-lg", "dark:bg-neutral-900 dark:border-neutral-700"), role: "listbox", children: options.map((option) => (_jsx("button", { type: "button", onClick: () => !option.disabled && handleSelect(option.value), className: clsx("flex w-full items-center px-3 py-2.5 text-left text-sm", "transition-colors duration-150", "hover:bg-neutral-100 dark:hover:bg-neutral-800", option.value === value && "bg-neutral-50 dark:bg-neutral-800", option.disabled && "cursor-not-allowed opacity-50"), role: "option", "aria-selected": option.value === value, disabled: option.disabled, children: option.label }, option.value))) }))] }));
};
