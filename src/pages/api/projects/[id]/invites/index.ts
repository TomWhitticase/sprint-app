import { apiHandler } from "@/lib/api-handler";

import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

// GET api/projects/{id}/invites - get all  invites for a project
// POST api/projects/{id}/invites - invite a user to the project

/**
 * @swagger
 * /api/projects/{id}/invites:
 *   post:
 *     tags: [Projects]
 *     summary: Invites a user to a project
 *     description: Invite a user to a project by user ID. Only the leader of the project can invite users.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to invite
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The invite was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the invite
 *                 projectId:
 *                   type: string
 *                   description: The ID of the project
 *                 userId:
 *                   type: string
 *                   description: The ID of the user who was invited
 *       400:
 *         description: User ID or Project ID is missing or the user is already a member
 *       401:
 *         description: Unauthorized - user must be the leader of the project to invite users
 *       404:
 *         description: The project or the user was not found
 *       500:
 *         description: There was an error creating the invite
 */

const createInvite = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const userId = req.body.userId as string;
  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }
  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({
      message: "Project ID is required",
    });
  }
  try {
    const project = await prisma.project.findUnique({
      where: { id },
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
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.leaderId !== session!.user.id) {
      return res.status(401).json({
        message: "You are not authorized to invite users to this project",
      });
    }
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    if (project.members.some((member) => member.id === userId)) {
      return res.status(400).json({
        message: "User is already a member of this project",
      });
    }
    //
    // const isInvited = await prisma.projectInvite.findFirst({
    //   where: { userId, projectId: id },
    // });
    // if (isInvited) {
    //   return res.status(400).json({
    //     message: "User has already been invited to this project",
    //   });
    // }
    const invite = await prisma.projectInvite.create({
      data: { projectId: id, userId },
    });
    return res.status(201).json(invite);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "There was an error creating the invite",
    });
  }
};

/**
 * @swagger
 * /api/projects/{id}/invites:
 *   get:
 *     tags: [Projects]
 *     summary: Retrieves all invites for a project
 *     description: Retrieve all invites for a project by project ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: An array of invite objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the invite
 *                   projectId:
 *                     type: string
 *                     description: The ID of the project
 *                   userId:
 *                     type: string
 *                     description: The ID of the user who was invited
 *       400:
 *         description: Project ID is missing
 *       401:
 *         description: Unauthorized - user must be the leader of the project to view invites
 *       404:
 *         description: No invites found for this project
 *       500:
 *         description: There was an error retrieving the invites
 */

const getInvites = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({
      message: "Project ID is required",
    });
  }
  try {
    const invites = await prisma.projectInvite.findMany({
      where: { projectId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        project: true,
      },
    });
    if (!invites) {
      return res
        .status(404)
        .json({ message: "No invites found for this project" });
    }
    return res.status(200).json(invites);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "There was an error retrieving the invites",
    });
  }
};

export default apiHandler({
  POST: { handler: createInvite },
  GET: { handler: getInvites },
});
