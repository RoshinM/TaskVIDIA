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
import type { Project, Task, TaskPriority, TaskType, User } from "@/types";

type TaskValues = Omit<Task, "id">;

const emptyTask: TaskValues = {
  title: "",
  description: "",
  type: "TASK",
  status: "TODO",
  priority: "MEDIUM",
  assigneeId: "u1",
  projectId: "",
  dueDate: "",
};

export function TaskDialog({
  open,
  onOpenChange,
  projects,
  users,
  task,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  users: User[];
  task?: Task;
  onSave: (values: TaskValues, task?: Task) => Promise<void>;
}) {
  const [values, setValues] = useState<TaskValues>(() =>
    task
      ? {
          title: task.title,
          description: task.description,
          type: task.type,
          status: task.status,
          priority: task.priority,
          assigneeId: task.assigneeId,
          projectId: task.projectId,
          dueDate: task.dueDate,
        }
      : { ...emptyTask, projectId: projects[0]?.id ?? "" },
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
              : "Add a piece of work to your workspace."}
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select
                value={values.projectId}
                onValueChange={(value) =>
                  value && setValues({ ...values, projectId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={values.type}
                onValueChange={(value) =>
                  value && setValues({ ...values, type: value as TaskType })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["TASK", "FEATURE", "BUG", "IMPROVEMENT"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
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
                  <SelectValue />
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
            <Button type="submit" disabled={saving || projects.length === 0}>
              {saving ? "Saving…" : task ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
