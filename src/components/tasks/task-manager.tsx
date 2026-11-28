"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { statuses, statusLabels } from "@/components/tasks/task-badge";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskTable } from "@/components/tasks/task-table";
import { useWorkspaceData } from "@/components/providers/workspace-data-provider";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTask,
  deleteTask,
  getTasksPage,
  updateTask,
  type TaskFilters,
} from "@/services/task-service";
import type { PaginationMeta, Task, TaskStatus } from "@/types";

const DEFAULT_PAGE_SIZE = 3;

export function TaskManager({
  title,
  description,
  projectId,
  myTasks = false,
  limit,
}: {
  title: string;
  description: string;
  projectId?: string;
  myTasks?: boolean;
  limit?: number;
}) {
  const { user, users, projects } = useWorkspaceData();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [projectFilter, setProjectFilter] = useState(projectId ?? "all");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: limit ?? DEFAULT_PAGE_SIZE,
    totalPages: 1,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task>();
  const [deletingTask, setDeletingTask] = useState<Task>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (myTasks && !user) return;

    let active = true;

    void (async () => {
      await Promise.resolve();
      if (!active) return;
      setLoading(true);
      setError("");

      const filters: TaskFilters = {
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(status !== "all" ? { status: status as TaskStatus } : {}),
        ...(projectFilter !== "all" ? { projectId: projectFilter } : {}),
        ...(myTasks && user ? { assigneeId: user.id } : {}),
        page,
        limit: limit ?? DEFAULT_PAGE_SIZE,
      };

      try {
        const result = await getTasksPage(filters);
        if (!active) return;
        setTasks(result.tasks);
        setPagination(result.pagination);
        setPage((current) =>
          Math.min(current, Math.max(result.pagination.totalPages, 1)),
        );
      } catch (loadError: unknown) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load tasks.",
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [
    myTasks,
    projectId,
    user,
    search,
    status,
    projectFilter,
    page,
    limit,
    refreshKey,
  ]);

  const shownTasks = limit ? tasks.slice(0, limit) : tasks;
  const currentProject = projectId
    ? projects.find((item) => item.id === projectId)
    : undefined;
  const dialogProject =
    currentProject ??
    projects.find((item) => item.id === editingTask?.projectId);

  async function saveTask(values: Omit<Task, "id">, task?: Task) {
    try {
      if (task) await updateTask({ ...values, id: task.id });
      else await createTask(values);
      setRefreshKey((current) => current + 1);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this task.",
      );
      throw saveError;
    }
  }

  async function removeTask(task: Task) {
    try {
      await deleteTask(task.id);
      setDeletingTask(undefined);
      setRefreshKey((current) => current + 1);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete task.",
      );
    }
  }

  async function changeStatus(task: Task, nextStatus: TaskStatus) {
    try {
      await updateTask({ ...task, status: nextStatus });
      setRefreshKey((current) => current + 1);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update task.",
      );
    }
  }

  function openNewTask() {
    setEditingTask(undefined);
    setDialogOpen(true);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        {!myTasks && currentProject && (
          <Button size="sm" onClick={openNewTask}>
            <Plus />
            New task
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-t-lg border border-border bg-card p-3">
        <div className="relative min-w-48 flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Filter tasks"
            className="h-8 pl-8 text-xs"
          />
        </div>
        {!projectId && (
          <Select
            value={projectFilter}
            onValueChange={(value) => {
              if (!value) return;
              setProjectFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue>
                {(value: string | null) =>
                  projects.find((item) => item.id === value)?.name ??
                  "All projects"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select
          value={status}
          onValueChange={(value) => {
            if (!value) return;
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue>
              {(value: string | null) =>
                value && value !== "all"
                  ? (statusLabels[value as TaskStatus] ?? value)
                  : "All statuses"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
      {loading ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Loading tasks…
        </div>
      ) : (
        <>
          <TaskTable
            tasks={shownTasks}
            projects={projects}
            users={users}
            showProject={!projectId}
            onEdit={(task) => {
              setEditingTask(task);
              setDialogOpen(true);
            }}
            onDelete={(task) => setDeletingTask(task)}
            onStatusChange={changeStatus}
          />
          {!limit && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
      {dialogProject && (
        <TaskDialog
          key={`${editingTask?.id ?? currentProject?.id ?? "new"}-${dialogOpen}`}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          project={dialogProject}
          users={users}
          task={editingTask}
          onSave={saveTask}
        />
      )}
      <ConfirmDialog
        open={Boolean(deletingTask)}
        onOpenChange={(open) => {
          if (!open) setDeletingTask(undefined);
        }}
        title="Delete task?"
        description={
          deletingTask
            ? `“${deletingTask.title}” will be removed from the workspace. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete task"
        onConfirm={() => deletingTask && removeTask(deletingTask)}
      />
    </section>
  );
}
