import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import ActiveProjects from "@/components/widgets/active-projects";
import ArchivedProjects from "@/components/widgets/archived-projects";
import TaskPrioritySnapshot from "@/components/widgets/task-priority-snaphsot";
import TaskStatusSnapshot from "@/components/widgets/task-status-snapshot";
import TasksAssigned from "@/components/widgets/tasks-assigned";
import UpcomingTasks from "@/components/widgets/upcoming-tasks";
import { useTasks } from "@/hooks/use-tasks";
import { useSession } from "next-auth/react";
import React from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { tasks, tasksIsLoading } = useTasks(undefined, true);

  return (
    <>
      <Head title="Dashboard" />
      <ProjectLinkBar links={[]} current={"Dashboard"} />
      <main className="flex flex-col w-full h-full gap-4 p-4">
        <div className="py-2 text-4xl ">
          Welcome back, <span className="font-bold">{session?.user?.name}</span>
        </div>

        <div className="flex w-full gap-4">
          <div className="w-1/3">
            <TasksAssigned count={tasks?.length} />
          </div>
          <div className="w-1/3">
            <ActiveProjects />
          </div>
          <div className="w-1/3">
            <ArchivedProjects />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col flex-1 gap-4">
            <div className="flex flex-wrap gap-4">
              <TaskStatusSnapshot tasks={tasks} />
              <TaskPrioritySnapshot tasks={tasks} />
            </div>
          </div>
          <UpcomingTasks tasks={tasks} />
        </div>
      </main>
    </>
  );
}
