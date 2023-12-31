//DELETE api/tasks/{id} - delete a task
//PUT api/tasks/{id} - update a task
//GET api/tasks/{id} - get a task

import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const deleteTask = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const { id } = req.query;
  const task = await prisma.task.findUnique({
    where: { id: id as string },
    include: {
      project: {
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
      },
    },
  });

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  //ensure the user is a member of the tasks project
  const isMember = task.project.members.some(
    (member) => member.id === session?.user?.id
  );
  const isLeader = task.project.leader.id === session?.user?.id;
  if (!isMember && !isLeader) {
    res.status(403).json({ message: "You are not a member of this project" });
    return;
  }

  await prisma.task.delete({
    where: { id: id as string },
  });
  res.status(200).json(task);
};

const updateTask = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const { id } = req.query;
  const {
    name,
    description,
    startDate,
    endDate,
    status,
    priority,
    todos,
    assigneeIds,
  } = req.body;

  // Fetch task with provided ID
  const task = await prisma.task.findUnique({
    where: { id: id as string },
    include: {
      project: {
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
      },
    },
  });

  // If task doesn't exist, return 404 error
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  //ensure the user is a member of the tasks project
  const isMember = task.project.members.some(
    (member) => member.id === session?.user?.id
  );
  const isLeader = task.project.leader.id === session?.user?.id;
  if (!isMember && !isLeader) {
    res.status(403).json({ message: "You are not a member of this project" });
    return;
  }

  // Update the task
  const updatedTask = await prisma.task.update({
    where: { id: id as string },
    data: {
      name: name,
      description: description,
      startDate: startDate && new Date(startDate),
      endDate: endDate && new Date(endDate),
      status: status,
      priority: priority,
      todos: todos,
      assignees: assigneeIds && {
        set: [],
        connect: assigneeIds.map((id: string) => ({ id })),
      },
    },
  });

  // Respond with the updated task
  res.status(200).json(updatedTask);
};

const getTask = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const { id } = req.query;
  const task = await prisma.task.findUnique({
    where: { id: id as string },
    include: {
      assignees: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.status(200).json(task);
};

export default apiHandler({
  DELETE: { handler: deleteTask },
  PUT: { handler: updateTask },
  GET: { handler: getTask },
});
