import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import ProjectSubNavItem from "@/components/projects/project-sub-nav-item";
import { useProject } from "@/hooks/use-project";
import { Button, Input, Textarea } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaFileAlt, FaTasks, FaUsers } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";

type ProjectPageProps = {
  id: string;
};

export default function ProjectPage({ id }: ProjectPageProps) {
  const { project, projectIsLoading, deleteProject, removeUserFromProject } =
    useProject(id);
  const [projectName, setProjectName] = useState(project?.name || "");
  const [projectDescription, setProjectDescription] = useState(
    project?.description || ""
  );
  const router = useRouter();
  const { data: session } = useSession();

  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(id);
      router.push("/projects");
    } catch (error) {
      alert("something went wrong");
    }
    setDeleting(false);
  };

  const handleArchive = async () => {
    setArchiving(true);
    try {
      await deleteProject(id);
      router.push("/projects");
    } catch (error) {
      alert("something went wrong");
    }
    setArchiving(false);
  };

  const handleLeave = async () => {
    setLeaving(true);
    try {
      await removeUserFromProject({ projectId: id, userId: session?.user.id });
      router.push("/projects");
    } catch (error) {
      alert("something went wrong");
    }
    setLeaving(false);
  };

  useEffect(() => {
    setProjectName(project?.name || "");
    setProjectDescription(project?.description || "");
  }, [project]);

  if (projectIsLoading) return <div></div>;
  return (
    <>
      <Head title={project.name} />

      <ProjectLinkBar
        links={[{ link: "/projects", text: "Projects" }]}
        current={project.name}
      />
      <main className="flex flex-col gap-4 p-4">
        <div className="flex flex-col items-start justify-center gap-4 p-4 bg-white border-2 rounded-lg">
          <span className="flex items-center justify-center h-8 gap-4">
            <h1 className="text-xl font-bold">Project Name</h1>
            {projectName !== project?.name && (
              <Button variant="black">Save Changes</Button>
            )}
          </span>
          <div className="flex w-full gap-4">
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full"
            />
          </div>
          <span className="flex items-center justify-center h-8 gap-4">
            <h1 className="text-xl font-bold">Project Description</h1>
            {projectDescription !== project?.description && (
              <Button variant="black">Save Changes</Button>
            )}
          </span>
          <div className="flex w-full gap-4">
            <Textarea
              cols={3}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-4 p-4 bg-white border-2 rounded-lg ">
          <h1 className="text-xl font-bold">Project Links</h1>
          <ProjectSubNavItem
            variant="black"
            name={"Team"}
            link={"/projects/" + id + "/team"}
            icon={<FaUsers />}
          />
          <ProjectSubNavItem
            variant="black"
            name={"Tasks"}
            link={"/projects/" + id + "/tasks"}
            icon={<FaTasks />}
          />
          <ProjectSubNavItem
            variant="black"
            name={"Resources"}
            link={"/projects/" + id + "/resources"}
            icon={<FaFileAlt />}
          />
          <ProjectSubNavItem
            variant="black"
            name={"Discussions"}
            link={"/projects/" + id + "/discussions"}
            icon={<IoMdChatboxes />}
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-4 p-4 bg-white border-2 rounded-lg ">
          <h1 className="text-xl font-bold">Danger Zone</h1>
          <Button
            variant="black"
            onClick={() => {
              if (!leaving) handleLeave();
            }}
          >
            {leaving ? "Leaving..." : "Leave Project"}
          </Button>

          <Button variant="white" onClick={handleArchive} disabled={archiving}>
            {archiving ? "Archiving..." : "Archive Project"}
          </Button>
          <Button colorScheme="red" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Project"}
          </Button>
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
