import { ArrowUpRight, FolderKanban, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CURRENT_USER_ID } from "@/lib/current-user";
import type { Project, Task } from "@/types";

export function ProjectCard({
  project,
  tasks,
  onEdit,
  onDelete,
}: {
  project: Project;
  tasks: Task[];
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const completed = tasks.filter((task) => task.status === "DONE").length;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;
  const isCreator = project.createdById === CURRENT_USER_ID;

  return (
    <div className="relative">
      <Link
        href={`/projects/${project.id}`}
        className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Card className="transition-shadow group-hover:shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                <FolderKanban className="size-4.5" />
              </span>
              {(onEdit || onDelete) && <span className="size-8" aria-hidden />}
            </div>
            <div className="flex items-center gap-1 pt-1">
              <CardTitle className="text-sm font-semibold group-hover:text-primary">
                {project.name}
              </CardTitle>
              <Badge
                variant={isCreator ? "secondary" : "outline"}
                className="text-[9px]"
              >
                {isCreator ? "Creator" : "Member"}
              </Badge>
              <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 line-clamp-2 min-h-9 text-xs leading-relaxed text-muted-foreground">
              {project.description ||
                "A place to plan and track your team's work."}
            </p>
            <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>
                {completed} of {tasks.length} tasks completed
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="secondary">{tasks.length} tasks</Badge>
              <span className="text-[10px] text-muted-foreground">
                {project.memberIds.length} members
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
      {(onEdit || onDelete) && (
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for ${project.name}`}
                >
                  <MoreHorizontal />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  Edit project
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                  Delete project
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
