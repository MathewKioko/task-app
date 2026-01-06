import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Dropdown } from "../ui/Dropdown";
import { Button } from "../ui/Button";
import { useTaskActions, useLists } from "../../features/tasks/selectors";
const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];
export const TaskModal = ({ isOpen, onClose, task, mode = "create", onTaskSaved, }) => {
    const [selectedPriority, setSelectedPriority] = useState("medium");
    const [selectedListId, setSelectedListId] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
    });
    // Use Zustand store
    const lists = useLists();
    const { addTask, updateTask } = useTaskActions();
    // Initialize form values when task is provided (edit mode) or reset for create mode
    useEffect(() => {
        if (isOpen) {
            if (task) {
                setFormData({
                    title: task.title,
                    description: task.description || "",
                    dueDate: task.dueDate || "",
                });
                setSelectedPriority(task.priority);
                setSelectedListId(task.listId);
            }
            else {
                setFormData({
                    title: "",
                    description: "",
                    dueDate: "",
                });
                setSelectedPriority("medium");
                setSelectedListId("");
            }
        }
    }, [task, isOpen]);
    // Build list options from loaded lists
    const listOptions = useMemo(() => {
        return lists.map(list => ({
            value: list.id,
            label: list.name,
        }));
    }, [lists]);
    // Get default list ID
    const defaultListId = lists[0]?.id || "default-list";
    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = {
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate || undefined,
            priority: selectedPriority,
            listId: selectedListId || defaultListId,
            completed: task?.completed || false,
        };
        try {
            if (mode === "create" || !task) {
                await addTask(taskData);
            }
            else {
                await updateTask(task.id, taskData);
            }
            onTaskSaved?.();
            onClose();
        }
        catch (error) {
            console.error("Failed to save task:", error);
            // In a real app, you'd show an error message to the user
        }
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: mode === "create" ? "Create new task" : "Edit task", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "title", className: "mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: ["Title ", _jsx("span", { className: "text-error", children: "*" })] }), _jsx(Input, { id: "title", name: "title", placeholder: "Enter task title", value: formData.title, onChange: (e) => handleFormChange("title", e.target.value), required: true, autoFocus: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: "Description" }), _jsx(Textarea, { id: "description", name: "description", placeholder: "Add a description (optional)", value: formData.description, onChange: (e) => handleFormChange("description", e.target.value), rows: 3 })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "dueDate", className: "mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: "Due date" }), _jsx(Input, { id: "dueDate", name: "dueDate", type: "date", value: formData.dueDate, onChange: (e) => handleFormChange("dueDate", e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-5", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "priority", className: "mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: ["Priority ", _jsx("span", { className: "text-error", children: "*" })] }), _jsx(Dropdown, { options: priorityOptions, value: selectedPriority, placeholder: "Select priority", onChange: (value) => setSelectedPriority(value) })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "listId", className: "mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: ["List ", _jsx("span", { className: "text-error", children: "*" })] }), _jsx(Dropdown, { options: listOptions.length > 0 ? listOptions : [{ value: defaultListId, label: "Default List" }], value: selectedListId || task?.listId || defaultListId, placeholder: "Select list", onChange: (value) => setSelectedListId(value) })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-3", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: onClose, children: "Cancel" }), _jsx(Button, { type: "submit", children: mode === "create" ? "Create Task" : "Save Changes" })] })] }) }));
};
