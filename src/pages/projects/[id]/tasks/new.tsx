import ProjectLinkBar from "@/components/projects/project-link-bar";
import NewTask from "@/components/tasks/new-task";
import { useTasks } from "@/hooks/use-tasks";
import { GetServerSideProps } from "next";
import Head from "@/components/Head";
import React from "react";
import { useProject } from "@/hooks/use-project";
import ReactLoading from "react-loading";

interface TasksPageProps {
  id: string;
}
export default function NewTaskPage({ id }: TasksPageProps) {
  const { project, projectIsLoading } = useProject(id);
  const { tasks, createTask, tasksIsLoading, updateTask, deleteTask } =
    useTasks(id);

  if (projectIsLoading || tasksIsLoading) {
    return (
      <>
        <Head title={"Loading..."} />
        <div>
          <ReactLoading
            type={"bubbles"}
            color={"#333"}
            height={50}
            width={50}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Head title={project.name + " - Tasks"} />
      <ProjectLinkBar
        links={[
          { link: "/projects", text: "Projects" },
          { link: "/projects/" + id, text: project.name },
          { link: "/projects/" + id + "/tasks", text: "Tasks" },
        ]}
        current={"New"}
      />
      <main className="flex flex-col w-full h-full gap-2 p-4">
        <div className="p-4 bg-white border-2 rounded-lg">
          <NewTask createTask={createTask} project={project} />
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as any;
  return {
    props: { id },
  };
};
