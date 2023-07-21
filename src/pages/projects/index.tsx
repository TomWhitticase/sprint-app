import Head from "@/components/Head";
import NewProject from "@/components/projects/new-project";
import ProjectCard from "@/components/projects/project-card";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import { useProjects } from "@/hooks/use-projects";
import { Button, Input } from "@chakra-ui/react";
import { Project, User } from "@prisma/client";
import { Router, useRouter } from "next/router";
import React from "react";

export default function Home() {
  const router = useRouter();
  const { projects, projectsIsLoading, createProject, deleteProject } =
    useProjects();

  return (
    <>
      <Head title="Projects" />

      <ProjectLinkBar links={[]} current={"Projects"} />

      <main className="flex flex-col items-start justify-start w-full h-full gap-2 p-4">
        <div className="flex items-center justify-between w-full gap-2">
          <Input
            bg={"white"}
            placeholder="Search projects..."
            className="w-full"
          />
          <Button
            variant={"black"}
            onClick={() => router.push("/projects/new")}
          >
            New Project
          </Button>
        </div>
        <div className="flex flex-wrap items-start justify-start w-full">
          {projects?.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full gap-2 p-4 bg-white border-2 rounded-lg">
              <h1>You have no projects</h1>
            </div>
          )}
          {projects?.map((project) => (
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
