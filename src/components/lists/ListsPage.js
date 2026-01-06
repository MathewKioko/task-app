import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useMemo } from "react";
import { clsx } from "clsx";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";
import { useLists, useListActions, useTasks } from "../../features/tasks/selectors";
export const ListsPage = ({ className, onAddList, ...props }) => {
    // Use Zustand store
    const lists = useLists();
    const tasks = useTasks();
    const { addList, updateList, deleteList } = useListActions();
    // State for UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingListId, setEditingListId] = useState(undefined);
    const [listName, setListName] = useState("");
    const [error, setError] = useState(null);
    const [confirmDeleteListId, setConfirmDeleteListId] = useState(null);
    // Modal handlers
    const handleOpenModal = useCallback((listId) => {
        if (listId) {
            const list = lists.find(l => l.id === listId);
            if (list) {
                setListName(list.name);
                setEditingListId(listId);
            }
        }
        else {
            setListName("");
            setEditingListId(undefined);
        }
        setIsModalOpen(true);
        setError(null);
    }, [lists]);
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingListId(undefined);
        setListName("");
        setError(null);
    }, []);
    const handleSaveList = useCallback(async () => {
        if (!listName.trim()) {
            setError("List name is required");
            return;
        }
        try {
            if (editingListId) {
                await updateList(editingListId, { name: listName.trim() });
            }
            else {
                await addList({ name: listName.trim() });
            }
            handleCloseModal();
        }
        catch (error) {
            console.error("Failed to save list:", error);
            setError("Failed to save list. Please try again.");
        }
    }, [listName, editingListId, updateList, addList, handleCloseModal]);
    const handleDeleteList = useCallback(async (listId) => {
        const list = lists.find(l => l.id === listId);
        if (!list)
            return;
        // Check if list has tasks
        const listTasks = tasks.filter(t => t.listId === listId);
        if (listTasks.length > 0) {
            setError("Cannot delete a list that contains tasks. Please move tasks to another list first.");
            return;
        }
        setConfirmDeleteListId(listId);
    }, [lists, tasks, deleteList]);
    const handleConfirmDeleteList = useCallback(async () => {
        if (!confirmDeleteListId)
            return;
        try {
            await deleteList(confirmDeleteListId);
            setConfirmDeleteListId(null);
        }
        catch (error) {
            console.error("Failed to delete list:", error);
            setError("Failed to delete list. Please try again.");
        }
    }, [confirmDeleteListId, deleteList]);
    // Get task counts for each list
    const listStats = useMemo(() => {
        return lists.map(list => {
            const listTasks = tasks.filter(t => t.listId === list.id);
            const completedTasks = listTasks.filter(t => t.completed);
            return {
                ...list,
                taskCount: listTasks.length,
                completedCount: completedTasks.length,
                activeCount: listTasks.length - completedTasks.length,
            };
        });
    }, [lists, tasks]);
    return (_jsxs("div", { className: clsx("flex flex-col h-full", className), ...props, children: [_jsx("div", { className: "border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight", children: "Lists" }), _jsx(Button, { onClick: () => handleOpenModal(), size: "md", children: _jsx("span", { children: "Add List" }) })] }) }), _jsx("div", { className: "flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-950/50 p-6", children: lists.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCCB" }), _jsx("h2", { className: "text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2", children: "No lists yet" }), _jsx("p", { className: "text-neutral-500 dark:text-neutral-400 mb-6 max-w-md", children: "Create your first list to organize your tasks. Lists help you categorize and manage your tasks more effectively." }), _jsx(Button, { onClick: () => handleOpenModal(), children: "Create your first list" })] })) : (_jsx("div", { className: "grid gap-4", children: listStats.map((list) => (_jsxs("div", { className: clsx("flex items-center justify-between rounded-xl border bg-white p-4 transition-all duration-200", "dark:bg-neutral-900 dark:border-neutral-800", "hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700", "shadow-xs"), children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-neutral-900 dark:text-neutral-50", children: list.name }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mt-1", children: [_jsxs("span", { children: [list.taskCount, " total tasks"] }), _jsxs("span", { className: "text-green-600 dark:text-green-400", children: [list.completedCount, " completed"] }), _jsxs("span", { className: "text-blue-600 dark:text-blue-400", children: [list.activeCount, " active"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleOpenModal(list.id), className: "h-8 w-8 p-0", children: "Edit" }), list.id !== "default-list" && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteList(list.id), className: "h-8 w-8 p-0 text-neutral-500 hover:bg-red-50 hover:text-error dark:hover:bg-red-500/10", children: "Delete" }))] })] }, list.id))) })) }), _jsx(Modal, { isOpen: isModalOpen, onClose: handleCloseModal, title: editingListId ? "Edit List" : "Create New List", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "listName", className: "mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300", children: ["List Name ", _jsx("span", { className: "text-error", children: "*" })] }), _jsx(Input, { id: "listName", name: "listName", placeholder: "Enter list name", value: listName, onChange: (e) => setListName(e.target.value), required: true, autoFocus: true }), error && (_jsx("p", { className: "mt-2 text-sm text-error", children: error }))] }), _jsxs("div", { className: "flex justify-end gap-3 pt-3", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: handleCloseModal, children: "Cancel" }), _jsx(Button, { type: "submit", onClick: handleSaveList, children: editingListId ? "Save Changes" : "Create List" })] })] }) }), _jsx(ConfirmationDialog, { isOpen: confirmDeleteListId !== null, onClose: () => setConfirmDeleteListId(null), onConfirm: handleConfirmDeleteList, title: "Delete List", message: `Are you sure you want to delete this list? This action cannot be undone.`, confirmText: "Delete List", cancelText: "Cancel", variant: "danger" })] }));
};
