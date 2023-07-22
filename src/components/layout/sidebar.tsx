import React from "react";
import { useRouter } from "next/router";
import NavButton from "./nav-button";
import UserProfile from "./user-profile";
import { useProjects } from "@/hooks/use-projects";
import {
  FaArchive,
  FaChartBar,
  FaEnvelope,
  FaHome,
  FaPlus,
  FaTasks,
} from "react-icons/fa";
import ReactLoading from "react-loading";
import ProjectNavItem from "./project-nav-item";
import { useInvites } from "@/hooks/use-invites";
import { Image } from "@chakra-ui/react";
import { ClientProject } from "@/services/apiService";

export default function Sidebar() {
  const router = useRouter();

  const { projects, projectsIsLoading } = useProjects();
  const { invites } = useInvites();

  return (
    <div className="relative flex flex-col flex-1 gap-2 p-4 w-[17rem] bg-system-blue z-[500]">
      <div className="flex flex-col flex-1 h-full gap-0">
        <span
          onClick={() => router.push("/")}
          className="flex items-center justify-start gap-2 pb-4 cursor-pointer"
        >
          <Image
            src="/images/logo.png"
            alt={"sprint logo"}
            width={8}
            height={8}
          />
          <span className="text-xl font-bold text-white">Sprint</span>
        </span>
        <NavButton link={"/dashboard"} text={"Dashboard"} icon={<FaHome />} />
        <NavButton link={"/tasks"} text={"Tasks"} icon={<FaTasks />} />
        <NavButton link={"/archive"} text={"Archive"} icon={<FaArchive />} />
        <NavButton
          link={"/invites"}
          text={"Invites"}
          icon={<FaEnvelope />}
          notifications={invites?.length}
        />
        <div className="flex flex-col flex-1 gap-0 pt-2">
          <span className="flex items-center justify-between">
            <h1
              onClick={() => router.push("/projects")}
              className="text-lg font-bold tracking-wide uppercase transition-all duration-300 ease-in-out cursor-pointer text-system-blue-text hover:text-system-grey-text"
            >
              Projects
            </h1>
            <button
              onClick={() => router.push("/projects/new")}
              className="flex items-center justify-center w-8 h-8 transition-all duration-300 rounded-lg bg-system-blue-light hover:bg-system-blue-veryLight"
            >
              <FaPlus className="text-white" />
            </button>
          </span>
          <div className="relative flex flex-col w-full h-full overflow-y-auto">
            <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col px-2 transition-all duration-300 ease-in-out">
              {projectsIsLoading ? (
                <ReactLoading
                  type={"bubbles"}
                  color={"#ffffff"}
                  height={50}
                  width={50}
                />
              ) : (
                projects?.map((project: ClientProject) => (
                  <ProjectNavItem
                    key={project.id}
                    id={project.id}
                    name={project.name}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <UserProfile />
    </div>
  );
}
