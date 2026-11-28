"use client";

import { FolderKanban, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceData } from "@/components/providers/workspace-data-provider";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/services/project-service";
import { getTasks } from "@/services/task-service";
import type { Project, Task } from "@/types";

export function ProjectManager() {
  const { user, projects, refreshProjects, loading: workspaceLoading } =
    useWorkspaceData();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project>();
  const [deletingProject, setDeletingProject] = useState<Project>();
  const [filter, setFilter] = useState<"all" | "mine" | "other">("all");

  useEffect(() => {
    let active = true;

    getTasks()
      .then((taskItems) => {
        if (active) setTasks(taskItems);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load tasks.",
          );
        }
      })
      .finally(() => {
        if (active) setTasksLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const loading = workspaceLoading || tasksLoading;

  async function saveProject(values: Pick<Project, "name" | "description">) {
    try {
      if (editingProject) {
        await updateProject({ ...values, id: editingProject.id });
      } else {
        await createProject(values);
      }
      await refreshProjects();
      setRefreshKey((current) => current + 1);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this project.",
      );
      throw saveError;
    }
  }

  async function removeProject(project: Project) {
    try {
      await deleteProject(project.id);
      await refreshProjects();
      setRefreshKey((current) => current + 1);
      setDeletingProject(undefined);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete project.",
      );
    }
  }

  const visibleProjects = projects.filter((project) => {
    const currentUserId = user?.id ?? "";
    if (filter === "mine") return Boolean(currentUserId) && project.createdById === currentUserId;
    if (filter === "other")
      return (
        Boolean(currentUserId) &&
        project.createdById !== currentUserId &&
        project.memberIds.includes(currentUserId)
      );
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A home for the work your team is moving forward.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProject(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus />
          New project
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <fieldset
          className="m-0 inline-flex rounded-lg border-0 bg-muted p-0.5"
          aria-label="Filter projects"
        >
          <Button
            type="button"
            size="sm"
            variant={filter === "all" ? "default" : "ghost"}
            className={filter === "all" ? "shadow-sm" : "text-muted-foreground"}
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All projects
          </Button>
          <Button
            type="button"
            size="sm"
            variant={filter === "mine" ? "default" : "ghost"}
            className={
              filter === "mine" ? "shadow-sm" : "text-muted-foreground"
            }
            aria-pressed={filter === "mine"}
            onClick={() => setFilter("mine")}
          >
            My projects
          </Button>
          <Button
            type="button"
            size="sm"
            variant={filter === "other" ? "default" : "ghost"}
            className={
              filter === "other" ? "shadow-sm" : "text-muted-foreground"
            }
            aria-pressed={filter === "other"}
            onClick={() => setFilter("other")}
          >
            Other projects
          </Button>
        </fieldset>
        <p className="text-xs text-muted-foreground">
          {filter === "mine"
            ? `${visibleProjects.length} created by you`
            : filter === "other"
              ? `${visibleProjects.length} shared with you`
              : `${visibleProjects.length} total`}
        </p>
      </div>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : visibleProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <FolderKanban className="mx-auto mb-3 size-8 text-muted-foreground" />
          <h2 className="text-sm font-medium">
            {filter === "mine"
              ? "No projects you created yet"
              : filter === "other"
                ? "No shared projects yet"
                : "No projects yet"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {filter === "mine"
              ? "Create a project and it will show up here."
              : filter === "other"
                ? "You are not a member of any projects created by others yet."
                : "Create your first project to give the team a place to start."}
          </p>
          <Button
            className="mt-4"
            size="sm"
            onClick={() =>
              filter !== "all" && projects.length > 0
                ? setFilter("all")
                : setDialogOpen(true)
            }
          >
            {filter !== "all" && projects.length > 0 ? (
              "View all projects"
            ) : (
              <>
                <Plus />
                Create project
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={tasks.filter((task) => task.projectId === project.id)}
              onEdit={
                project.createdById === user?.id
                  ? () => {
                      setEditingProject(project);
                      setDialogOpen(true);
                    }
                  : undefined
              }
              onDelete={
                project.createdById === user?.id
                  ? () => setDeletingProject(project)
                  : undefined
              }
            />
          ))}
        </div>
      )}
      <ProjectDialog
        key={`${editingProject?.id ?? "new"}-${dialogOpen}`}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
        onSave={saveProject}
      />
      <ConfirmDialog
        open={Boolean(deletingProject)}
        onOpenChange={(open) => {
          if (!open) setDeletingProject(undefined);
        }}
        title="Delete project?"
        description={
          deletingProject
            ? `“${deletingProject.name}” and all of its tasks will be removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete project"
        onConfirm={() => deletingProject && removeProject(deletingProject)}
      />
    </div>
  );
}
