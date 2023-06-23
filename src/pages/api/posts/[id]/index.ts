//DELETE api/posts/{id} - delete a post
//PUT api/posts/{id} - update a post [TODO]
//GET api/posts/{id} - get a post

import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { get } from "http";
import { NextApiRequest, NextApiResponse } from "next";

const deletePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const postId = req.query.id;

  //delete post from db
  const deletedPost = await prisma.post.delete({
    where: { id: postId as string },
  });

  return res.status(200).json(deletedPost);
};

const getPost = async (req: NextApiRequest, res: NextApiResponse) => {
  const postId = req.query.id;

  //get post from db, including author and comments
  const post = await prisma.post.findUnique({
    where: { id: postId as string },
    include: {
      postComments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
          childrenComments: true,
        },
      },
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

  return res.status(200).json(post);
};

export default apiHandler({
  DELETE: { handler: deletePost },
  GET: { handler: getPost },
});
