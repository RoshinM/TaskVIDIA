"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Input } from "@/components/ui/input";

const titles: Record<string, string> = {
  "/": "Overview",
  "/projects": "Projects",
  "/my-tasks": "My tasks",
};

export function WorkspaceHeader() {
  const pathname = usePathname();
  const pageTitle = pathname.startsWith("/projects/")
    ? "Project details"
    : (titles[pathname] ?? "Workspace");

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/80 px-5 md:px-8">
      <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
        <span className="text-foreground">{pageTitle}</span>
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        <search
          className="relative hidden w-56 sm:block"
          aria-label="Search tasks"
        >
          <Input
            aria-label="Search tasks"
            placeholder="Search tasks..."
            className="h-8 pl-8 pr-12 text-xs"
          />
        </search>
        <ThemeToggle />
      </div>
    </header>
  );
}
