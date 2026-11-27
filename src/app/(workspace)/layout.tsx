import { type ReactNode, Suspense } from "react";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { WorkspaceSidebar } from "@/components/layout/workspace-sidebar";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <Suspense fallback={null}>
        <WorkspaceSidebar />
      </Suspense>
      <div className="min-w-0">
        <Suspense fallback={null}>
          <WorkspaceHeader />
        </Suspense>
        <main className="mx-auto w-full max-w-[1320px] px-4 py-7 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
