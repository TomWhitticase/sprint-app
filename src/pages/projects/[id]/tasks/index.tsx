import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import KanbanBoard from "@/components/tasks/kanban-board";
import { useProject } from "@/hooks/use-project";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import React from "react";
import ReactLoading from "react-loading";
import { FiCalendar, FiList } from "react-icons/fi";
import { FiGrid } from "react-icons/fi";
import TaskList from "@/components/tasks/task-list";
import { useTasks } from "@/hooks/use-tasks";
import NewTask from "@/components/tasks/new-task";
import { useRouter } from "next/router";
import TaskCalendar from "@/components/tasks/task-calendar";

interface TasksPageProps {
  id: string;
}
export default function TasksPage({ id }: TasksPageProps) {
  const { project, projectIsLoading } = useProject(id);
  const { tasks, createTask, tasksIsLoading, updateTask, deleteTask } =
    useTasks(id);
  const router = useRouter();

  const viewMode = router.query.viewMode || "grid";

  const changeViewMode = (mode: "grid" | "list" | "calendar") => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, viewMode: mode },
    });
  };

  if (projectIsLoading || tasksIsLoading)
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

  return (
    <>
      <Head title={project.name + " - Tasks"} />
      <ProjectLinkBar
        links={[
          { link: "/projects", text: "Projects" },
          { link: "/projects/" + id, text: project.name },
        ]}
        current={"Tasks"}
      />
      <main className="flex flex-col w-full h-full gap-2 p-4">
        <div className="flex items-center gap-2 jsutify-between">
          <div className="flex items-center justify-center gap-2 p-1 bg-white border-2 rounded-lg">
            <Tooltip label="Grid View" aria-label="Grid View">
              <button
                onClick={() => changeViewMode("grid")}
                className={`flex transition-all duration-300 ease-in-out items-center justify-center w-8 h-8 rounded ${
                  viewMode === "grid" ? "bg-slate-200" : "bg-white"
                }`}
              >
                <FiGrid />
              </button>
            </Tooltip>
            <Tooltip label="List View" aria-label="List View">
              <button
                onClick={() => changeViewMode("list")}
                className={`flex transition-all duration-300 ease-in-out items-center justify-center w-8 h-8 rounded ${
                  viewMode === "list" ? "bg-slate-200" : "bg-white"
                }`}
              >
                <FiList />
              </button>
            </Tooltip>
            <Tooltip label="Calendar View" aria-label="Calendar View">
              <button
                onClick={() => changeViewMode("calendar")}
                className={`flex transition-all duration-300 ease-in-out items-center justify-center w-8 h-8 rounded ${
                  viewMode === "calendar" ? "bg-slate-200" : "bg-white"
                }`}
              >
                <FiCalendar />
              </button>
            </Tooltip>
          </div>

          <Button
            variant="black"
            onClick={() => {
              //navigate to projects/[id]/tasks/new
              router.push({
                pathname: router.pathname + "/new",
                query: router.query,
              });
            }}
          >
            New Task
          </Button>
        </div>

        {viewMode === "grid" ? (
          <KanbanBoard tasks={tasks || []} updateTask={updateTask} />
        ) : viewMode === "list" ? (
          <TaskList tasks={tasks || []} />
        ) : (
          <TaskCalendar tasks={tasks || []} />
        )}
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
