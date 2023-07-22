import Head from "@/components/Head";
import ProjectCard from "@/components/projects/project-card";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import { useProjects } from "@/hooks/use-projects";
import { Button, Input } from "@chakra-ui/react";
import { Project, User } from "@prisma/client";
import React from "react";

export default function ArchivePage() {
  const { projects } = useProjects(undefined, true);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  return (
    <>
      <Head title="Archive" />
      <ProjectLinkBar links={[]} current={"Archive"} />

      <main className="flex flex-col items-start justify-start w-full h-full gap-2 p-4">
        <div className="flex items-center justify-between w-full gap-2">
          <Input
            bg={"white"}
            placeholder="Search archived projects..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-start justify-start w-full">
          {projects?.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full gap-2 p-4 bg-white border-2 rounded-lg">
              <h1>You have no archived projects</h1>
            </div>
          )}
          {projects
            ?.filter(
              (project: Project & { leader: User; members: User[] }) =>
                project.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                project.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            )
            .map((project) => (
              <div
                key={project.id}
                className="p-2 desktop-only:w-1/2 mobile-only:w-full"
              >
                <ProjectCard project={project} />
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
