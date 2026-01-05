import { type FormEvent, useState, useMemo, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Dropdown } from "../ui/Dropdown";
import { Button } from "../ui/Button";
import { createTask, updateTask, getLists } from "../../api/tasks";
import type { Task, List } from "../../types";

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  taskId?: string;
  mode?: "create" | "edit";
  onTaskSaved?: () => void;
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const TaskModal = ({
  isOpen,
  onClose,
  task,
  mode = "create",
  onTaskSaved,
}: TaskModalProps) => {
  const [selectedPriority, setSelectedPriority] = useState<"low" | "medium" | "high">("medium");
  const [selectedListId, setSelectedListId] = useState("");
  const [lists, setLists] = useState<List[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  // Load lists
  useEffect(() => {
    if (isOpen) {
      getLists().then(setLists).catch(console.error);
    }
  }, [isOpen]);

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
      } else {
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

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        await createTask(taskData);
      } else {
        await updateTask(task.id, taskData);
      }

      onTaskSaved?.();
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
      // In a real app, you'd show an error message to the user
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create new task" : "Edit task"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Title <span className="text-error">*</span>
          </label>
          <Input
            id="title"
            name="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={(e) => handleFormChange("title", e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            placeholder="Add a description (optional)"
            value={formData.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
            rows={3}
          />
        </div>

        {/* Due Date */}
        <div>
          <label
            htmlFor="dueDate"
            className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Due date
          </label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleFormChange("dueDate", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Priority */}
          <div>
            <label
              htmlFor="priority"
              className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Priority <span className="text-error">*</span>
            </label>
            <Dropdown
              options={priorityOptions}
              value={selectedPriority}
              placeholder="Select priority"
              onChange={(value) => setSelectedPriority(value as "low" | "medium" | "high")}
            />
          </div>

          {/* List */}
          <div>
            <label
              htmlFor="listId"
              className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              List <span className="text-error">*</span>
            </label>
            <Dropdown
              options={listOptions.length > 0 ? listOptions : [{ value: defaultListId, label: "Default List" }]}
              value={selectedListId || task?.listId || defaultListId}
              placeholder="Select list"
              onChange={(value) => setSelectedListId(value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "create" ? "Create Task" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
