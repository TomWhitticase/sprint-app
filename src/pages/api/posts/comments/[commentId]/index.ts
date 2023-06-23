//DELETE api/posts/comments/{commentId} - delete a comment

import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

// Helper function to delete a comment and its children recursively
const deleteCommentAndChildren = async (commentId: string) => {
  // Get the children of the comment
  const children = await prisma.postComment.findMany({
    where: {
      parentCommentId: commentId,
    },
  });

  // Recursively delete the children
  for (let child of children) {
    await deleteCommentAndChildren(child.id);
  }

  // Delete the comment after all its children have been deleted
  await prisma.postComment.delete({
    where: {
      id: commentId,
    },
  });
};

const deleteComment = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const { commentId } = req.query;

  //get the comment
  const comment = await prisma.postComment.findUnique({
    where: {
      id: commentId as string,
    },
  });
  //check if comment exists
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  //check if user is authorized to delete comment
  if (comment.authorId !== session?.user?.id) {
    return res.status(403).json({
      message: "Unauthorized, you are not the author of this comment",
    });
  }

  //delete comment and its children recursively
  await deleteCommentAndChildren(commentId as string);

  return res.status(200).json({ message: "Comment deleted" });
};
export default apiHandler({
  DELETE: { handler: deleteComment },
});
