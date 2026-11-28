"use client";

import { ArrowRight, FolderKanban, ListTodo, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { TaskManager } from "@/components/tasks/task-manager";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceData } from "@/components/providers/workspace-data-provider";
import { getFirstName } from "@/lib/utils";
import { getProjects } from "@/services/project-service";
import { getMyTasks, getTasks } from "@/services/task-service";
import type { Project, Task } from "@/types";

export function DashboardView() {
  const { user } = useWorkspaceData();
  const firstName = getFirstName(user?.name ?? "");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    Promise.all([
      getProjects(),
      getTasks(),
      user ? getMyTasks(user.id) : Promise.resolve([] as Task[]),
    ])
      .then(([projectItems, taskItems, myTaskItems]) => {
        setProjects(projectItems);
        setTasks(taskItems);
        setMyTasks(myTaskItems);
      })
      .catch((loadError: unknown) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load the workspace.",
        );
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToday(
        new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }).format(new Date()),
      );
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const stats = [
    {
      label: "Total projects",
      value: projects.length,
      icon: FolderKanban,
      note: "Across your workspace",
    },
    {
      label: "My tasks",
      value: myTasks.length,
      icon: ListTodo,
      note: "Assigned to you",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {today}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here’s what’s happening across your workspace.
          </p>
        </div>
        <Link
          href="/projects"
          className="inline-flex h-8 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          New project
        </Link>
      </section>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <section
        className="grid gap-3 sm:grid-cols-2"
        aria-label="Workspace summary"
      >
        {stats.map(({ label, value, icon: Icon, note }) => (
          <Card key={label} className="gap-3 py-4">
            <CardContent className="px-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <Icon className="size-4" />
              </div>
              <div className="mt-10 flex items-baseline gap-2">
                <span className="text-2xl font-semibold tracking-tight">
                  {loading ? "—" : value}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {note}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Projects</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              A quick look at what your team is working on.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex h-8 items-center gap-2 rounded-lg px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            All projects <ArrowRight className="size-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton className="h-48 rounded-xl" key={item} />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                tasks={tasks.filter((task) => task.projectId === project.id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-between gap-4 py-5">
              <div>
                <p className="text-sm font-medium">Create your first project</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Start with a shared space for a piece of work.
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex h-7 items-center gap-2 rounded-lg bg-primary px-2.5 text-xs font-medium text-primary-foreground"
              >
                <Plus className="size-3.5" />
                New project
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      <TaskManager
        title="Recent tasks"
        description="The latest updates from your workspace."
        limit={5}
      />
    </div>
  );
}
