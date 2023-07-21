import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import TaskList from "@/components/tasks/task-list";
import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import React, { useState } from "react";
import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import { useRouter } from "next/router";
import { FiCalendar, FiGrid, FiList } from "react-icons/fi";
import TaskCalendar from "@/components/tasks/task-calendar";
import KanbanBoard from "@/components/tasks/kanban-board";
import ReactLoading from "react-loading";
import Link from "next/link";

export default function TasksPage() {
  const { tasks, tasksIsLoading, updateTask } = useTasks(undefined, true);
  const { projects } = useProjects();
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    undefined
  );

  const filteredTasks = tasks?.filter((task) =>
    selectedProject ? task.projectId === selectedProject : true
  );

  const viewMode = router.query.viewMode || "grid";

  const changeViewMode = (mode: "grid" | "list" | "calendar") => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, viewMode: mode },
    });
  };
  return (
    <>
      <Head title="Tasks" />
      <ProjectLinkBar links={[]} current={"Tasks"} />
      {tasksIsLoading ? (
        <ReactLoading type={"bubbles"} color={"#333"} height={50} width={50} />
      ) : (
        <main className="flex flex-col w-full h-full gap-2 p-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center gap-2 p-1 bg-white border-2 rounded-lg w-min">
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
            {projects && (
              <Select
                flex={1}
                bg={"white"}
                placeholder="Tasks from all my projects"
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                {projects.map((project: Project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            )}
            <Popover>
              <PopoverTrigger>
                <Button variant={"black"}>New Task</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader className="flex items-center justify-start">
                  Select a project to create a task for
                </PopoverHeader>
                <PopoverBody>
                  {projects?.map((project: Project) => (
                    <Button
                      key={project.id}
                      variant={"ghost"}
                      onClick={() => {
                        router.push("/projects/" + project.id + "/tasks/new");
                      }}
                    >
                      {project.name}
                    </Button>
                  ))}
                  {!projects?.length > 0 && (
                    <>
                      <div className="p-2">
                        {" "}
                        You do not have any projects to create a task for
                      </div>
                      <Button variant={"white"}>
                        <Link className="" href={"/projects/new"}>
                          create a new Project
                        </Link>
                      </Button>
                    </>
                  )}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>

          {viewMode === "grid" ? (
            <KanbanBoard tasks={filteredTasks || []} updateTask={updateTask} />
          ) : viewMode === "list" ? (
            <TaskList tasks={filteredTasks || []} />
          ) : (
            <TaskCalendar tasks={filteredTasks || []} />
          )}
        </main>
      )}
    </>
  );
}
