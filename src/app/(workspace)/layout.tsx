import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { WorkspaceSidebar } from "@/components/layout/workspace-sidebar";
import { WorkspaceDataProvider } from "@/components/providers/workspace-data-provider";
import { BACKEND_URL, SESSION_COOKIE } from "@/lib/auth-constants";

export const instant = false;

export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  let authenticated = false;
  try {
    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    authenticated = response.ok;
  } catch {
    authenticated = false;
  }

  if (!authenticated) redirect("/login");

  return (
    <WorkspaceDataProvider>
      <div className="min-h-screen md:grid md:grid-cols-[240px_minmax(0,1fr)]">
        <Suspense fallback={null}>
          <WorkspaceSidebar />
        </Suspense>
        <div className="min-w-0">
          <Suspense fallback={null}>
            <WorkspaceHeader />
          </Suspense>
          <main className="mx-auto w-full max-w-330 px-4 py-7 sm:px-6 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </WorkspaceDataProvider>
  );
}
