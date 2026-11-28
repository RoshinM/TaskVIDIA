"use client";

import {
  CheckSquare2,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspaceData } from "@/components/providers/workspace-data-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout } from "@/services/auth-service";
import { getInitials } from "@/lib/utils";

const links = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/my-tasks", label: "My tasks", icon: CheckSquare2 },
];

function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, projects } = useWorkspaceData();

  async function signOut() {
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  }

  return (
    <div className="flex h-full flex-col px-3 py-4">
      <Link
        href="/"
        className="flex h-9 items-center gap-2 text-3xl font-semibold tracking-tight my-5"
      >
        TaskVIDIA
      </Link>

      <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        Workspace
      </p>
      <nav className="space-y-1" aria-label="Workspace">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex h-9 items-center gap-2.5 rounded-md px-2.5 text-xs transition-colors ${active ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mb-2 mt-8 flex items-center justify-between px-2">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Your projects
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Create project"
          onClick={() => router.push("/projects")}
        >
          <Plus />
        </Button>
      </div>
      {projects.slice(0, 3).map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="flex h-8 items-center gap-2.5 rounded-md px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <span className="size-2 shrink-0 rounded-sm bg-muted-foreground/40" />
          <span className="truncate">{project.name}</span>
        </Link>
      ))}

      <div className="flex-1" />
      <div className="flex items-center gap-2.5 border-t border-sidebar-border pt-3">
        <span className="grid size-8 place-items-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-200">
          {getInitials(user?.name ?? "User")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-medium">
            {user?.name ?? "Account"}
          </span>
          <span className="block truncate text-[10px] text-muted-foreground">
            {user?.email ?? ""}
          </span>
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Sign out"
          onClick={signOut}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function WorkspaceSidebar() {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar md:block">
        <SidebarContent />
      </aside>
      <div className="flex items-center border-b border-border bg-card px-4 py-2 md:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                aria-label="Open navigation"
              >
                <FolderKanban />
              </Button>
            }
          />
          <SheetContent side="left" className="w-72 bg-sidebar p-0">
            <SheetTitle className="sr-only">TaskVDIA navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Workspace pages and projects
            </SheetDescription>
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <Link href="/" className="ml-3 text-sm font-semibold">
          TaskVDIA
        </Link>
      </div>
    </>
  );
}
