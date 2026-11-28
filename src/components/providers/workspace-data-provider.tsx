"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "@/lib/api-client";
import { getCurrentUser } from "@/services/auth-service";
import { getProjects } from "@/services/project-service";
import { getUsers } from "@/services/user-service";
import type { AuthUser, Project, User } from "@/types";

type WorkspaceData = {
  user: AuthUser | null;
  users: User[];
  projects: Project[];
  loading: boolean;
  error: string;
  refreshProjects: () => Promise<void>;
};

const WorkspaceDataContext = createContext<WorkspaceData | null>(null);

function errorMessage(reason: unknown, fallback: string) {
  return reason instanceof Error ? reason.message : fallback;
}

export function WorkspaceDataProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    void Promise.allSettled([getCurrentUser(), getUsers(), getProjects()]).then(
      ([userResult, usersResult, projectsResult]) => {
        if (!active) return;

        if (userResult.status === "fulfilled") {
          setUser(userResult.value);
        } else {
          setError(errorMessage(userResult.reason, "Could not load your account."));
          if (
            userResult.reason instanceof ApiError &&
            userResult.reason.status === 401
          ) {
            router.replace("/login");
          }
        }

        if (usersResult.status === "fulfilled") {
          setUsers(usersResult.value);
        } else {
          setError(errorMessage(usersResult.reason, "Could not load users."));
        }

        if (projectsResult.status === "fulfilled") {
          setProjects(projectsResult.value);
        } else {
          setError(
            errorMessage(projectsResult.reason, "Could not load projects."),
          );
        }

        setLoading(false);
      },
    );

    return () => {
      active = false;
    };
  }, [router]);

  async function refreshProjects() {
    setProjects(await getProjects());
  }

  return (
    <WorkspaceDataContext.Provider
      value={{ user, users, projects, loading, error, refreshProjects }}
    >
      {children}
    </WorkspaceDataContext.Provider>
  );
}

export function useWorkspaceData() {
  const value = useContext(WorkspaceDataContext);
  if (!value) {
    throw new Error("useWorkspaceData must be used within WorkspaceDataProvider");
  }
  return value;
}
