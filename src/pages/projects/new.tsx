import Head from "@/components/Head";
import NewProject from "@/components/projects/new-project";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import { useProjects } from "@/hooks/use-projects";
import React from "react";

export default function NewProjectPage() {
  const { createProject } = useProjects();
  return (
    <>
      <Head title="New Project" />
      <ProjectLinkBar
        links={[{ link: "/projects", text: "Projects" }]}
        current={"New Project"}
      />
      <main>
        <NewProject createProject={createProject} />
      </main>
    </>
  );
}
