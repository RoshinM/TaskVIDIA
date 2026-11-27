"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { statuses, statusLabels } from "@/components/tasks/task-badge";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskTable } from "@/components/tasks/task-table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { users } from "@/data/mock-data";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { getProjects } from "@/services/project-service";
import {
  createTask,
  deleteTask,
  getMyTasks,
  getProjectTasks,
  getTasks,
  updateTask,
} from "@/services/task-service";
import type { Project, Task, TaskStatus } from "@/types";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [projectFilter, setProjectFilter] = useState(projectId ?? "all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task>();
  const [deletingTask, setDeletingTask] = useState<Task>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      myTasks
        ? getMyTasks(CURRENT_USER_ID)
        : projectId
          ? getProjectTasks(projectId)
          : getTasks(),
      getProjects(),
    ])
      .then(([taskItems, projectItems]) => {
        setTasks(taskItems);
        setProjects(projectItems);
      })
      .catch((loadError: unknown) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load tasks.",
        );
      })
      .finally(() => setLoading(false));
  }, [myTasks, projectId]);

  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesSearch = task.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus = status === "all" || task.status === status;
        const matchesProject =
          projectFilter === "all" || task.projectId === projectFilter;
        return matchesSearch && matchesStatus && matchesProject;
      }),
    [tasks, search, status, projectFilter],
  );

  const shownTasks = limit ? visibleTasks.slice(0, limit) : visibleTasks;

  async function saveTask(values: Omit<Task, "id">, task?: Task) {
    const saved = task
      ? await updateTask({ ...values, id: task.id })
      : await createTask(values);
    setTasks((current) =>
      task
        ? current.map((item) => (item.id === task.id ? saved : item))
        : [saved, ...current],
    );
  }

  async function removeTask(task: Task) {
    try {
      await deleteTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      setDeletingTask(undefined);
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
      const updated = await updateTask({ ...task, status: nextStatus });
      setTasks((current) =>
        current.map((item) => (item.id === task.id ? updated : item)),
      );
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
        <Button
          size="sm"
          onClick={openNewTask}
          disabled={projects.length === 0}
        >
          <Plus />
          New task
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-t-lg border border-border bg-card p-3">
        <div className="relative min-w-48 flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter tasks"
            className="h-8 pl-8 text-xs"
          />
        </div>
        {!projectId && (
          <Select
            value={projectFilter}
            onValueChange={(value) => value && setProjectFilter(value)}
          >
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue />
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
          onValueChange={(value) => value && setStatus(value)}
        >
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue />
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
      )}
      <TaskDialog
        key={`${editingTask?.id ?? "new"}-${dialogOpen}`}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projects={projects}
        users={users}
        task={editingTask}
        onSave={saveTask}
      />
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
