//DELETE /api/tasks/[id]/comments/[commentId] - delete a comment

import { apiHandler } from "@/lib/api-handler";

import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const deleteComment = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const { id, commentId } = req.query;
  try {
    //esnure the user is the creator of the comment
    const comment = await prisma.taskComment.findUnique({
      where: {
        id: commentId as string,
      },
      select: {
        userId: true,
      },
    });
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    if (comment.userId !== session!.user?.id) {
      res
        .status(403)
        .json({ message: "You are not the creator of this comment" });
      return;
    }

    const taskComment = await prisma.taskComment.delete({
      where: {
        id: commentId as string,
      },
    });

    return res.status(204).json(taskComment);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export default apiHandler({
  DELETE: { handler: deleteComment },
});
