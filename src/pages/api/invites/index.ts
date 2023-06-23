//GET api/invites - get all invites for the current user

import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

/**
 * @swagger
 * /api/invites:
 *   get:
 *     tags: [Invites]
 *     summary: Fetches all invites for the current user
 *     description: Retrieve all invites for the current user's projects.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The invites were successfully fetched
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
 *                   project:
 *                     type: object
 *                     description: The project details
 *       401:
 *         description: Unauthorized - user must be logged in
 *       500:
 *         description: There was an error fetching the invites
 */

const getInvites = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  //get all invites for the current user
  const invites = await prisma.projectInvite.findMany({
    where: { userId: session!.user.id },
    include: { project: true },
  });
  return res.status(200).json(invites);
};

export default apiHandler({
  GET: { handler: getInvites },
});
