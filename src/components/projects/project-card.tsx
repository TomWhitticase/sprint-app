import {
  Button,
  Divider,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Project, User } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import UserAvatar from "../users/user-avatar";
import UserAvatarGroup from "../users/user-avatar-group";

export interface ProjectCardProps {
  project: Project & { members: User[]; leader: User };
}
export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/projects/${project.id}`);
  };
  return (
    <div
      className="flex flex-col p-4 bg-white border-2 rounded-lg cursor-pointer "
      onClick={handleClick}
    >
      <h1 className="text-xl font-bold">{project.name}</h1>
      <p className="text-lg">{project.description}</p>

      <Table size="sm" colorScheme="blackAlpha" className="mt-4 bg-white">
        <Thead>
          <Tr>
            <Th>Leader</Th>
            <Th>Members</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <UserAvatar user={project.leader} />
            </Td>
            <Td>
              <UserAvatarGroup users={project.members} max={5} />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  );
}
