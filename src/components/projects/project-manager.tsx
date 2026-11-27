"use client";

import { FolderKanban, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CURRENT_USER_ID } from "@/lib/current-user";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "@/services/project-service";
import { getTasks } from "@/services/task-service";
import type { Project, Task } from "@/types";

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project>();
  const [deletingProject, setDeletingProject] = useState<Project>();
  const [filter, setFilter] = useState<"all" | "mine" | "other">("all");

  useEffect(() => {
    Promise.all([getProjects(), getTasks()])
      .then(([projectItems, taskItems]) => {
        setProjects(projectItems);
        setTasks(taskItems);
      })
      .catch((loadError: unknown) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load projects.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveProject(project: Project | Omit<Project, "id">) {
    const saved =
      "id" in project
        ? await updateProject(project)
        : await createProject(project);
    setProjects((current) =>
      "id" in project
        ? current.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...current],
    );
  }

  async function removeProject(project: Project) {
    try {
      await deleteProject(project.id);
      setProjects((current) =>
        current.filter((item) => item.id !== project.id),
      );
      setTasks((current) =>
        current.filter((task) => task.projectId !== project.id),
      );
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
    if (filter === "mine") return project.createdById === CURRENT_USER_ID;
    if (filter === "other")
      return (
        project.createdById !== CURRENT_USER_ID &&
        project.memberIds.includes(CURRENT_USER_ID)
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
              onEdit={() => {
                setEditingProject(project);
                setDialogOpen(true);
              }}
              onDelete={() => setDeletingProject(project)}
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
