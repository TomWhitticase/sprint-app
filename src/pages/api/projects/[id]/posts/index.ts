//GET api/projects/{id}/posts - get all posts for a project

import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

const getPosts = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectId = req.query.id;
  const posts = await prisma.post.findMany({
    where: { projectId: projectId as string },
    include: {
      postComments: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });

  return res.status(200).json(posts);
};

const createPost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const projectId = req.query.id;
  const { title, content, tags } = req.body;

  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      tags,
      author: {
        connect: {
          id: session?.user?.id as string,
        },
      },
      project: {
        connect: {
          id: projectId as string,
        },
      },
    },
  });

  return res.status(201).json(newPost);
};

export default apiHandler({
  GET: { handler: getPosts },
  POST: { handler: createPost },
});
