//GET /api/projects/archived - get all archived projects for the user

import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const getProjects = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const user = session!.user;

  //get query params
  const role = typeof req.query.role === "string" ? req.query.role : undefined;

  try {
    let projects;
    switch (role) {
      case "leader":
        projects = await prisma.project.findMany({
          where: { leaderId: user.id, archived: false },
          include: {
            leader: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        });
        break;
      case "member":
        projects = await prisma.project.findMany({
          where: { members: { some: { id: user.id } }, archived: false },
          include: {
            leader: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        });
        break;
      default:
        projects = await prisma.project.findMany({
          where: {
            OR: [{ leaderId: user.id }, { members: { some: { id: user.id } } }],
            archived: true,
          },
          include: {
            leader: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        });
    }

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching projects",
      success: false,
    });
  }
};

export default apiHandler({
  GET: { handler: getProjects },
});
