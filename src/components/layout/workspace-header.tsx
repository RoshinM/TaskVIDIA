"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";

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
        <ThemeToggle />
      </div>
    </header>
  );
}
