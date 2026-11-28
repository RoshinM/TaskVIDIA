"use client";

import { type FormEvent, useState } from "react";
import { priorities, priorityLabels } from "@/components/tasks/task-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceData } from "@/components/providers/workspace-data-provider";
import type { Project, Task, TaskPriority, User } from "@/types";

type TaskValues = Omit<Task, "id">;

const emptyTask: TaskValues = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  assigneeId: "",
  projectId: "",
  dueDate: "",
};

export function TaskDialog({
  open,
  onOpenChange,
  project,
  users,
  task,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  users: User[];
  task?: Task;
  onSave: (values: TaskValues, task?: Task) => Promise<void>;
}) {
  const { user } = useWorkspaceData();
  const [values, setValues] = useState<TaskValues>(() =>
    task
      ? {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigneeId: task.assigneeId,
          projectId: task.projectId,
          dueDate: task.dueDate,
        }
      : {
          ...emptyTask,
          projectId: project.id,
          assigneeId: project.memberIds.includes(user?.id ?? "")
            ? (user?.id ?? "")
            : (project.memberIds[0] ?? ""),
        },
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const assignees = users.filter((item) => project.memberIds.includes(item.id));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSave(values, task);
      onOpenChange(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this task.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "Create a task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update the details and keep the team in sync."
              : `Add a piece of work to ${project.name}.`}
          </DialogDescription>
        </DialogHeader>
        <form
          key={`${task?.id ?? "new"}-${open}`}
          onSubmit={submit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="task-title">Task name</Label>
            <Input
              id="task-title"
              required
              maxLength={120}
              value={values.title}
              placeholder="e.g. Review homepage copy"
              onChange={(event) =>
                setValues({ ...values, title: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={values.description}
              rows={3}
              placeholder="Add a few details (optional)"
              onChange={(event) =>
                setValues({ ...values, description: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Assignee</Label>
            <Select
              value={values.assigneeId}
              onValueChange={(value) =>
                value && setValues({ ...values, assigneeId: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string | null) =>
                    users.find((item) => item.id === value)?.name ??
                    "Choose an assignee"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {assignees.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={values.priority}
              onValueChange={(value) =>
                value &&
                setValues({ ...values, priority: value as TaskPriority })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string | null) =>
                    value
                      ? (priorityLabels[value as TaskPriority] ?? value)
                      : "Choose a priority"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priorityLabels[priority]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-date">Due date</Label>
            <Input
              id="task-date"
              type="date"
              value={values.dueDate}
              onChange={(event) =>
                setValues({ ...values, dueDate: event.target.value })
              }
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || assignees.length === 0}>
              {saving ? "Saving…" : task ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
