import { Project } from "@prisma/client";
import { useRouter } from "next/router";
import React, { use, useMemo } from "react";
import { FaChevronDown, FaFileAlt, FaTasks, FaUsers } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import ProjectSubNavItem from "../projects/project-sub-nav-item";

interface ProjectNavItemProps {
  name: string;
  id: string;
}
export default function ProjectNavItem({ name, id }: ProjectNavItemProps) {
  const router = useRouter();
  const selected = router.query.id === id;

  const handleClick = () => {
    if (router.query.id !== id) {
      router.push(`/projects/${id}`);
    } else {
      router.push(`/projects`);
    }
  };

  //get tag color by hashing project id
  const tagColor = useMemo(() => {
    const hash = (s: string) =>
      s.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
    const color = "#" + Math.floor(Math.abs(hash(id)) % 16777215).toString(16);
    return color;
  }, [id]);

  return (
    <div className="flex flex-col gap-2 transition-all duration-300 ease-in-out">
      <div
        onClick={handleClick}
        className={`flex group justify-between rounded-lg px-2 py-2 duration-300 transition-all ease-in-out items-center gap-2  cursor-pointer
        ${selected ? "text-white" : "text-slate-400"}
              `}
      >
        <span className="flex items-center justify-start gap-2">
          <span
            style={{ backgroundColor: tagColor }}
            className={`w-4 h-4 rounded`}
          ></span>
          {name}
        </span>
        <span
          className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out
            ${
              selected
                ? "transform rotate-180 opacity-100"
                : "transform rotate-0"
            }`}
        >
          <FaChevronDown />
        </span>
      </div>
      <div
        className={`flex transition-all ease-in-out flex-col gap-2 ml-4 duration-300  overflow-hidden ${
          selected ? "max-h-96" : "max-h-0"
        }`}
      >
        <ProjectSubNavItem
          name={"Team"}
          link={"/projects/" + id + "/team"}
          icon={<FaUsers />}
        />
        <ProjectSubNavItem
          name={"Tasks"}
          link={"/projects/" + id + "/tasks"}
          icon={<FaTasks />}
        />
        <ProjectSubNavItem
          name={"Resources"}
          link={"/projects/" + id + "/resources"}
          icon={<FaFileAlt />}
        />
        <ProjectSubNavItem
          name={"Discussions"}
          link={"/projects/" + id + "/discussions"}
          icon={<IoMdChatboxes />}
        />
      </div>
    </div>
  );
}
