"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { TeamDialog } from "@/components/projects/team-dialog";
import { TaskManager } from "@/components/tasks/task-manager";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { getInitials } from "@/lib/utils";
import { getProject, updateProject } from "@/services/project-service";
import { searchUsers } from "@/services/user-service";
import type { Project, User } from "@/types";

export function ProjectDetailView({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project>();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);

  useEffect(() => {
    Promise.all([getProject(projectId), searchUsers("")])
      .then(([projectItem, userItems]) => {
        setProject(projectItem);
        setUsers(userItems);
      })
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

  const creator = users.find((user) => user.id === project.createdById);
  const members = project.memberIds
    .map((id) => users.find((user) => user.id === id))
    .filter((user): user is User => Boolean(user));
  const isCreator = project.createdById === CURRENT_USER_ID;

  async function saveProject(next: Project | Omit<Project, "id">) {
    if ("id" in next) setProject(await updateProject(next));
  }

  async function saveTeam(next: Project) {
    setProject(await updateProject(next));
  }

  return (
    <div className="space-y-7">
      <Link
        className="inline-flex h-8 items-center gap-2 rounded-lg px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        href="/projects"
      >
        <ArrowLeft className="size-4" />
        All projects
      </Link>
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant={isCreator ? "secondary" : "outline"} className="mb-2">
            {isCreator ? "Creator" : "Member"}
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">
            {project.name}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setProjectDialogOpen(true)}
        >
          Manage project
        </Button>
      </section>
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <AvatarGroup>
              {members.map((user) => (
                <Avatar key={user.id} size="sm">
                  <AvatarFallback className="bg-secondary text-[9px] font-medium text-secondary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <div>
              <p className="text-sm font-medium">Project team</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Created by {creator?.name ?? "Unknown"} ·{" "}
                {project.memberIds.length} members
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTeamDialogOpen(true)}
          >
            Manage team
          </Button>
        </CardContent>
      </Card>
      <TaskManager
        title="Project tasks"
        description="Track the work connected to this project."
        projectId={projectId}
      />
      <ProjectDialog
        key={`project-${project.id}-${projectDialogOpen}`}
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        project={project}
        onSave={saveProject}
      />
      <TeamDialog
        key={`team-${project.id}-${teamDialogOpen}`}
        open={teamDialogOpen}
        onOpenChange={setTeamDialogOpen}
        project={project}
        users={users}
        onSave={saveTeam}
      />
    </div>
  );
}
