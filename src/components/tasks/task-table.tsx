"use client";

import { CalendarDays, MoreHorizontal } from "lucide-react";
import {
  statuses,
  statusLabels,
  TaskPriorityBadge,
  TaskStatusBadge,
} from "@/components/tasks/task-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Project, Task, TaskStatus, User } from "@/types";

export function TaskTable({
  tasks,
  projects,
  users,
  showProject = true,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  tasks: Task[];
  projects: Project[];
  users: User[];
  showProject?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="min-w-57.5">Task</TableHead>
              {showProject && <TableHead>Project</TableHead>}
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showProject ? 7 : 6}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No tasks here yet.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => {
                const project = projects.find(
                  (item) => item.id === task.projectId,
                );
                const assignee = users.find(
                  (item) => item.id === task.assigneeId,
                );

                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="size-2 rounded-full bg-primary/60" />
                        <span
                          className={
                            task.status === "DONE"
                              ? "text-muted-foreground line-through"
                              : "font-medium"
                          }
                        >
                          {task.title}
                        </span>
                      </div>
                    </TableCell>
                    {showProject && (
                      <TableCell className="text-muted-foreground">
                        {project?.name ?? "—"}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Avatar size="sm">
                          <AvatarFallback className="bg-secondary text-[9px] font-medium text-secondary-foreground">
                            {assignee?.initials ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        {assignee?.name.split(" ")[0] ?? "Unassigned"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TaskStatusBadge status={task.status} />
                    </TableCell>
                    <TableCell>
                      <TaskPriorityBadge priority={task.priority} />
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {task.dueDate
                          ? new Date(
                              `${task.dueDate}T00:00:00`,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Actions for ${task.title}`}
                            >
                              <MoreHorizontal />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(task)}>
                            Edit task
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {statuses.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              disabled={status === task.status}
                              onClick={() => onStatusChange(task, status)}
                            >
                              Mark {statusLabels[status].toLowerCase()}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onDelete(task)}
                          >
                            Delete task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
