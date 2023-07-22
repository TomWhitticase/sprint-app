import Head from "@/components/Head";
import ProjectLinkBar from "@/components/projects/project-link-bar";
import ProjectSubNavItem from "@/components/projects/project-sub-nav-item";
import TaskPrioritySnapshot from "@/components/widgets/task-priority-snaphsot";
import TaskStatusSnapshot from "@/components/widgets/task-status-snapshot";
import UpcomingTasks from "@/components/widgets/upcoming-tasks";
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
  const {
    project,
    projectIsLoading,
    deleteProject,
    removeUserFromProject,
    updateProject,
  } = useProject(id);
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
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }
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
    if (
      !confirm(
        `Are you sure you want to ${
          project?.archived ? "unarchive" : "archive"
        } this project?`
      )
    ) {
      return;
    }

    setArchiving(true);
    try {
      await updateProject({
        projectId: id,
        archived: !project?.archived,
      });

      router.push("/projects");
    } catch (error) {
      alert("something went wrong");
    }
    setArchiving(false);
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this project?")) {
      return;
    }

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

  if (projectIsLoading || !project) return <div></div>;
  return (
    <>
      <Head title={project.name} />

      <ProjectLinkBar
        links={[{ link: "/projects", text: "Projects" }]}
        current={project.name}
      />
      <main className="flex flex-col gap-2 p-4">
        <div className="flex flex-col items-start justify-center gap-4 p-4 bg-white border-2 rounded-lg">
          <span className="flex items-center justify-center h-8 gap-4">
            <h1 className="text-xl font-bold">Project Name</h1>
            {projectName !== project?.name && (
              <Button
                onClick={() => {
                  if (projectName !== project?.name) {
                    updateProject({
                      projectId: id,
                      name: projectName,
                    });
                  }
                }}
                variant="black"
              >
                Save Changes
              </Button>
            )}
          </span>
          <div className="flex w-full gap-4">
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full"
            />
          </div>
          <span className="flex items-center justify-center h-8 gap-2">
            <h1 className="text-xl font-bold">Project Description</h1>
            {projectDescription !== project?.description && (
              <Button
                onClick={() => {
                  if (projectDescription !== project?.description) {
                    updateProject({
                      projectId: id,
                      description: projectDescription,
                    });
                  }
                }}
                variant="black"
              >
                Save Changes
              </Button>
            )}
          </span>
          <div className="flex w-full gap-2">
            <Textarea
              cols={3}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-start justify-end w-full gap-2">
            <Button
              variant="black"
              onClick={() => {
                if (!leaving) handleLeave();
              }}
              isDisabled={leaving}
              isLoading={leaving}
            >
              {leaving ? "Leaving..." : "Leave Project"}
            </Button>

            <Button
              variant="white"
              onClick={handleArchive}
              isDisabled={archiving}
              isLoading={archiving}
            >
              {project?.archived ? "Unarchive Project" : "Archive Project"}
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              isDisabled={deleting}
              isLoading={deleting}
            >
              {deleting ? "Deleting..." : "Delete Project"}
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-2 p-4 bg-white border-2 rounded-lg">
          <h1 className="text-xl font-bold">Project Links</h1>
          <div className="flex items-center justify-center gap-2">
            <ProjectSubNavItem
              variant={"black"}
              name={"Team"}
              link={"/projects/" + id + "/team"}
              icon={<FaUsers />}
            />
            <ProjectSubNavItem
              variant={"black"}
              name={"Tasks"}
              link={"/projects/" + id + "/tasks"}
              icon={<FaTasks />}
            />
            <ProjectSubNavItem
              variant={"black"}
              name={"Resources"}
              link={"/projects/" + id + "/resources"}
              icon={<FaFileAlt />}
            />
            <ProjectSubNavItem
              variant={"black"}
              name={"Discussions"}
              link={"/projects/" + id + "/discussions"}
              icon={<IoMdChatboxes />}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-2">
            <TaskStatusSnapshot tasks={project.tasks} />
            <TaskPrioritySnapshot tasks={project.tasks} />
          </div>
          <UpcomingTasks tasks={project.tasks} />
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
