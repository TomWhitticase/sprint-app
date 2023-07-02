import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import TaskList from "@/components/tasks/task-list";
import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import React, { useState } from "react";
import { Select } from "@chakra-ui/react";
import { Project } from "@prisma/client";

export default function TasksPage() {
  const { tasks } = useTasks(undefined, true);
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    undefined
  );

  const filteredTasks = tasks?.filter((task) =>
    selectedProject ? task.projectId === selectedProject : true
  );

  return (
    <>
      <Head title="Tasks" />
      <ProjectLinkBar links={[]} current={"Tasks"} />
      <main className="flex flex-col w-full h-full gap-4 p-4">
        {projects && (
          <Select
            bg={"white"}
            placeholder="Tasks from all projects"
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projects.map((project: Project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
        )}

        <TaskList tasks={filteredTasks} />
      </main>
    </>
  );
}
