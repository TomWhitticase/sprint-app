// POST api/projects/{id}/posts/{id}/comments - create a comment for a post

import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const createPostComment = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const postId = req.query.id;
  const { content, parentCommentId } = req.body;

  const newComment = await prisma.postComment.create({
    data: {
      content: content as string,
      parentCommentId: parentCommentId as string,
      authorId: session?.user?.id as string,
      postId: postId as string,
    },
  });

  return res.status(201).json(newComment);
};

export default apiHandler({
  POST: { handler: createPostComment },
});
