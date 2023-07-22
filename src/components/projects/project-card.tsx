import { useRouter } from "next/router";
import React from "react";
import UserAvatar from "../users/user-avatar";
import UserAvatarGroup from "../users/user-avatar-group";
import { Progress, Text } from "@chakra-ui/react";
import { FaTasks, FaFileAlt } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import { ClientProject } from "@/services/apiService";

export interface ProjectCardProps {
  project: ClientProject;
  onClick?: () => void;
}
export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick !== undefined) {
      onClick();
    } else {
      router.push(`/projects/${project.id}`);
    }
  };

  const projectProgress = React.useMemo(
    () =>
      (project.tasks.filter(({ status }) => status === "COMPLETED").length /
        project.tasks.length) *
        100 || 0,
    [project]
  );
  const completedCount = React.useMemo(
    () => project.tasks.filter(({ status }) => status === "COMPLETED").length,
    [project]
  );

  return (
    <div
      className="flex flex-col gap-2 p-4 bg-white border-2 rounded-lg cursor-pointer "
      onClick={handleClick}
    >
      <div className="flex items-center justify-start w-full gap-2">
        <h1 className="flex-1 w-full text-xl font-bold">{project.name}</h1>
        <UserAvatar user={project.leader} />
        <UserAvatarGroup
          users={project.members.filter(({ id }) => id !== project.leaderId)}
        />
      </div>
      <p className="text-lg">{project.description}</p>
      <p className="text-slate-400">
        Started {new Date(project.createdAt).toLocaleDateString("en-UK")}
      </p>
      <div className="flex flex-col items-end justify-center gap-1">
        <div className="text-slate-500">
          {completedCount} / {project.tasks.length} tasks completed
        </div>
        <div className="flex items-center justify-end w-full gap-2">
          <Text color="blue.500" as="b">
            {projectProgress.toFixed(0)}%
          </Text>
          <div className="flex-1">
            <Progress value={projectProgress} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start w-full gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/projects/${project.id}/tasks`);
          }}
          className="flex items-center justify-center gap-2 px-2 py-1 text-sm font-bold transition-all duration-300 ease-in-out rounded bg-slate-200 hover:text-orange-500 text-slate-500"
        >
          <FaTasks /> {project.tasks.length} tasks
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/projects/${project.id}/discussions`);
          }}
          className="flex items-center justify-center gap-2 px-2 py-1 text-sm font-bold transition-all duration-300 ease-in-out rounded bg-slate-200 hover:text-orange-500 text-slate-500"
        >
          <IoMdChatboxes /> {project.posts.length} Discussions
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/projects/${project.id}/resources`);
          }}
          className="flex items-center justify-center gap-2 px-2 py-1 text-sm font-bold transition-all duration-300 ease-in-out rounded bg-slate-200 hover:text-orange-500 text-slate-500"
        >
          <FaFileAlt /> {project.resources.length} Resources
        </button>
      </div>
    </div>
  );
}
