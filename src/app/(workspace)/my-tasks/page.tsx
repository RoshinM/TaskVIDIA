import { TaskManager } from "@/components/tasks/task-manager";

export default function MyTasksPage() {
  return (
    <TaskManager
      title="My tasks"
      description="A focused view of the work on your plate."
      myTasks
    />
  );
}
