"use client";

import { ArrowLeft, FolderKanban } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TaskManager } from "@/components/tasks/task-manager";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProject } from "@/services/project-service";
import type { Project } from "@/types";

export function ProjectDetailView({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project>();
  const [error, setError] = useState("");

  useEffect(() => {
    getProject(projectId)
      .then(setProject)
      .catch((loadError: unknown) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load this project.",
        ),
      );
  }, [projectId]);

  if (error)
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Link
            className="mx-auto mt-4 inline-flex h-8 items-center gap-2 rounded-lg border border-border px-3 text-sm hover:bg-muted"
            href="/projects"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
        </CardContent>
      </Card>
    );
  if (!project)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full" />
      </div>
    );

  return (
    <div className="space-y-7">
      <Link
        className="inline-flex h-8 items-center gap-2 rounded-lg px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        href="/projects"
      >
        <ArrowLeft className="size-4" />
        All projects
      </Link>
      <section className="flex items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {project.name}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>
      </section>
      <TaskManager
        title="Project tasks"
        description="Track the work connected to this project."
        projectId={projectId}
      />
    </div>
  );
}
