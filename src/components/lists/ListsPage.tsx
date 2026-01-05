import { type HTMLAttributes, useState, useCallback, useMemo } from "react";
import { clsx } from "clsx";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";
import { useLists, useListActions, useTasks } from "../../features/tasks/selectors";

export interface ListsPageProps extends HTMLAttributes<HTMLDivElement> {
  onAddList?: () => void;
}

export const ListsPage = ({
  className,
  onAddList,
  ...props
}: ListsPageProps) => {
  // Use Zustand store
  const lists = useLists();
  const tasks = useTasks();
  const { addList, updateList, deleteList } = useListActions();

  // State for UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListId, setEditingListId] = useState<string | undefined>(undefined);
  const [listName, setListName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteListId, setConfirmDeleteListId] = useState<string | null>(null);

  // Modal handlers
  const handleOpenModal = useCallback((listId?: string) => {
    if (listId) {
      const list = lists.find(l => l.id === listId);
      if (list) {
        setListName(list.name);
        setEditingListId(listId);
      }
    } else {
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
      } else {
        await addList({ name: listName.trim() });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save list:", error);
      setError("Failed to save list. Please try again.");
    }
  }, [listName, editingListId, updateList, addList, handleCloseModal]);

  const handleDeleteList = useCallback(async (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    // Check if list has tasks
    const listTasks = tasks.filter(t => t.listId === listId);
    if (listTasks.length > 0) {
      setError("Cannot delete a list that contains tasks. Please move tasks to another list first.");
      return;
    }

    setConfirmDeleteListId(listId);
  }, [lists, tasks, deleteList]);

  const handleConfirmDeleteList = useCallback(async () => {
    if (!confirmDeleteListId) return;

    try {
      await deleteList(confirmDeleteListId);
      setConfirmDeleteListId(null);
    } catch (error) {
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

  return (
    <div className={clsx("flex flex-col h-full", className)} {...props}>
      {/* Page Header */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Lists
          </h1>
          <Button onClick={() => handleOpenModal()} size="md">
            <span>Add List</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-neutral-50/50 dark:bg-neutral-950/50 p-6">
        {lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              No lists yet
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
              Create your first list to organize your tasks. Lists help you categorize and manage your tasks more effectively.
            </p>
            <Button onClick={() => handleOpenModal()}>
              Create your first list
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {listStats.map((list) => (
              <div
                key={list.id}
                className={clsx(
                  "flex items-center justify-between rounded-xl border bg-white p-4 transition-all duration-200",
                  "dark:bg-neutral-900 dark:border-neutral-800",
                  "hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700",
                  "shadow-xs"
                )}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                    {list.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    <span>{list.taskCount} total tasks</span>
                    <span className="text-green-600 dark:text-green-400">
                      {list.completedCount} completed
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {list.activeCount} active
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(list.id)}
                    className="h-8 w-8 p-0"
                  >
                    Edit
                  </Button>
                  {list.id !== "default-list" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteList(list.id)}
                      className="h-8 w-8 p-0 text-neutral-500 hover:bg-red-50 hover:text-error dark:hover:bg-red-500/10"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* List Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingListId ? "Edit List" : "Create New List"}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="listName"
              className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              List Name <span className="text-error">*</span>
            </label>
            <Input
              id="listName"
              name="listName"
              placeholder="Enter list name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              required
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-error">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveList}>
              {editingListId ? "Save Changes" : "Create List"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDeleteListId !== null}
        onClose={() => setConfirmDeleteListId(null)}
        onConfirm={handleConfirmDeleteList}
        title="Delete List"
        message={`Are you sure you want to delete this list? This action cannot be undone.`}
        confirmText="Delete List"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};