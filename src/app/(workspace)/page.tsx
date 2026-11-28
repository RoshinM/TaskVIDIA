import { Suspense } from "react";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const instant = false;

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardView />
    </Suspense>
  );
}
