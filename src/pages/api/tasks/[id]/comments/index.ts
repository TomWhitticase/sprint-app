//POST /api/tasks/[id]/comments - create a comment

import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const createComment = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const { id } = req.query;

  const { content } = req.body;

  //ensure the user is a member of the tasks project
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
  const isMember = task.project.members.some(
    (member) => member.id === session?.user?.id
  );
  const isLeader = task.project.leader.id === session?.user?.id;
  if (!isMember && !isLeader) {
    res.status(403).json({ message: "You are not a member of this project" });
    return;
  }

  const comment = await prisma.taskComment.create({
    data: {
      content,
      taskId: id as string,
      userId: session?.user?.id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });

  res.status(201).json(comment);
};

export default apiHandler({
  POST: { handler: createComment },
});

//for reference
// model TaskComment {
//   id        String   @id @unique @default(cuid())
//   userId    String
//   user      User     @relation(fields: [userId], references: [id])
//   taskId    String
//   task      Task     @relation(fields: [taskId], references: [id])
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt @default(now())
//   content   String

//   @@index([userId])
//   @@index([taskId])
// }
