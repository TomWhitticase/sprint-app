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
  res.status(200).json(resource);
};

const updateResource = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {};

export default apiHandler({
  DELETE: { handler: deleteResource },
  PUT: { handler: updateResource },
});
