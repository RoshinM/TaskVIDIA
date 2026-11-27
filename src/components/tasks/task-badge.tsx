import { Badge } from "@/components/ui/badge";
import type { TaskPriority, TaskStatus } from "@/types";

export const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
export const priorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

export const statusLabels: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const statusStyles: Record<TaskStatus, string> = {
  TODO: "border-red-500/20 bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  IN_PROGRESS:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  DONE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
};

const priorityStyles: Record<TaskPriority, string> = {
  LOW: "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
  MEDIUM:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  HIGH: "border-red-500/20 bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {statusLabels[status]}
    </Badge>
  );
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge variant="outline" className={priorityStyles[priority]}>
      {priorityLabels[priority]}
    </Badge>
  );
}
