//GET api/projects/{id}/tasks - get all tasks for a project
//POST api/projects/{id}/tasks - create a new task for a project

import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import prisma from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import { TaskPriority, TaskStatus } from "@prisma/client";

const getTasks = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const projectId = req.query.id as string;

  const tasks = await prisma.task.findMany({
    where: {
      projectId: projectId,
    },
    include: {
      assignees: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      comments: true,
    },
  });

  return res.status(200).json(tasks);
};

const createTask = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const {
    name,
    description,
    startDate,
    endDate,
    status,
    priority,
    todos,
    assignees,
  } = req.body;
  const projectId = req.query.id as string;

  const task = await prisma.task.create({
    data: {
      name,
      description,
      startDate,
      endDate,
      status: status as TaskStatus,
      priority: priority as TaskPriority,
      project: {
        connect: {
          id: projectId,
        },
      },
      assignees: {
        connect: assignees.map((assignee: string) => ({
          id: assignee,
        })),
      },
    },
    include: {
      assignees: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      comments: true,
    },
  });

  return res.status(201).json(task);
};

export default apiHandler({
  GET: { handler: getTasks },
  POST: { handler: createTask },
});
