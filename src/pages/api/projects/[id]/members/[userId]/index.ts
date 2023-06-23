import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

// DELETE api/projects/{id}/members/{userId} - remove a user from the project

/**
 * @swagger
 * /api/projects/{id}/members/{userId}:
 *   delete:
 *     tags: [Projects]
 *     summary: Remove a user from a project
 *     description: Remove a user from a project by providing the project ID and user ID. Only the leader of the project can remove users.
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to remove
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The user was successfully removed from the project. Returns the updated project.
 *       400:
 *         description: The request URL is missing the project ID or user ID
 *       401:
 *         description: Unauthorized - user must be logged in
 *       403:
 *         description: Forbidden - user must be the leader of the project to remove a member
 *       404:
 *         description: The project or user was not found
 *       500:
 *         description: There was an error removing the user from the project
 */
const removeUserFromProject = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const projectId = req.query.id as string;
  const userId = req.query.userId as string;
  const currentUser = session?.user;

  // validation of input params
  if (!projectId || !userId) {
    return res.status(400).json({
      message: "Project ID and User ID are required",
    });
  }

  // find the project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
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

  // check if the project exists
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // check if the current user is the leader of the project or they are the user to be removed
  if (project.leaderId !== currentUser?.id && userId !== currentUser?.id) {
    return res.status(403).json({
      message: "You are not authorized to remove users from this project",
    });
  }

  // check if the user to be removed is part of the project
  if (!project.members.some((member) => member.id === userId)) {
    return res.status(404).json({
      message: "User not found in this project",
    });
  }

  // remove the user from the project
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      members: {
        disconnect: { id: userId },
      },
    },
  });

  return res.status(200).json(updatedProject);
};

export default apiHandler({
  DELETE: { handler: removeUserFromProject },
});
