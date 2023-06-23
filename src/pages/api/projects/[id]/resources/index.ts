import { PrismaClient } from "@prisma/client";
import { apiHandler } from "@/lib/api-handler";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import prisma from "@/lib/prisma";

//GET /api/projects/{id}/resources - get all resources for a project
//POST /api/projects/{id}/resources - create a new resource

const getResources = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const projectId = req.query.id;
  const resources = await prisma.resource.findMany({
    where: { projectId: projectId as string },
  });

  res.status(200).json(resources);
};

const createResource = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const projectId = req.query.id;
  const { name, description, url, icon } = req.body;

  const newResource = await prisma.resource.create({
    data: {
      name,
      description,
      url,
      icon,
      project: {
        connect: {
          id: projectId as string,
        },
      },
    },
  });

  res.status(201).json(newResource);
};

export default apiHandler({
  GET: { handler: getResources },
  POST: { handler: createResource },
});
