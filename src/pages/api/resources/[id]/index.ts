//DELETE /api/resources/{id} - delete a resource
//PUT /api/resources/{id} - update a resource

import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const deleteResource = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const { id } = req.query;
  const resource = await prisma.resource.findUnique({
    where: { id: id as string },
  });
  if (!resource) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }
  await prisma.resource.delete({
    where: { id: id as string },
  });
  return res.status(200).json(resource);
};

const updateResource = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const { id } = req.query;
  const { name, description, url, icon } = req.body;

  //check that the resource exists
  const resource = await prisma.resource.findUnique({
    where: { id: id as string },
  });
  if (!resource) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }
  //check that the user is a member or leader of the project the resource belongs to
  const user = session!.user;
  const project = await prisma.project.findUnique({
    where: { id: resource.projectId },
    include: {
      leader: {
        select: {
          id: true,
        },
      },
      members: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!project) {
    res
      .status(404)
      .json({ message: "Project resource belongs to was not found" });
    return;
  }
  const isMember = project.members.some((member) => member.id === user.id);
  const isLeader = project.leader.id === user.id;
  if (!isMember && !isLeader) {
    res
      .status(403)
      .json({ message: "You are not authorized to update this resource" });
    return;
  }

  //update the resource
  const updatedResource = await prisma.resource.update({
    where: { id: id as string },
    data: {
      name: name ? name : resource.name,
      description: description ? description : resource.description,
      url: url ? url : resource.url,
      icon: icon ? icon : resource.icon,
    },
  });
  return res.status(200).json(updatedResource);
};

export default apiHandler({
  DELETE: { handler: deleteResource },
  PUT: { handler: updateResource },
});

//for reference
// model Resource {
//   id          String   @id @unique @default(cuid())
//   name        String
//   description String  @default("")
//   url         String
//   icon        String
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt @default(now())
//   project     Project  @relation(fields: [projectId], references: [id])
//   projectId   String

//   @@index([projectId])
// }
