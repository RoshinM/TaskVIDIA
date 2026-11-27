import { Suspense } from "react";
import { ProjectDetailView } from "@/components/projects/project-detail-view";

async function ProjectDetail({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectDetailView projectId={projectId} />;
}

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}
