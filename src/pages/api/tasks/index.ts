//GET /api/tasks - get all tasks assigned to the user

import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const getTasks = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  try {
    //get all tasks assigned to the user
    const tasks = await prisma.task.findMany({
      where: {
        assignees: {
          some: {
            id: session?.user?.id,
          },
        },
        project: {
          archived: false,
        },
      },
      include: {
        assignees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: true,
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error getting tasks" });
  }
};

export default apiHandler({
  GET: { handler: getTasks },
});
