import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "@/lib/api-handler";

// POST api/invites/{id} - accept invite
// DELETE api/invites/{id} - delete an invitation

/**
 * @swagger
 * /api/invites/{id}:
 *   post:
 *     tags: [Invites]
 *     summary: Accepts an invitation
 *     description: Accept an invitation by ID. Only the invited user can accept it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the invitation to accept
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The project data after accepting the invite
 *       400:
 *         description: The request URL is missing the invitation ID
 *       401:
 *         description: Unauthorized - user must be logged in or not the invited user
 *       404:
 *         description: The invitation was not found
 *       500:
 *         description: There was an error while accepting the invitation
 */
const acceptInvite = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  // Ensure session exists
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized, no active session" });
  }

  // Get the invite id from the url
  const inviteId = req.query.id as string;

  // Get the invite from the db
  const invite = await prisma.projectInvite.findUnique({
    where: {
      id: inviteId,
    },
  });

  // Check if the invite exists
  if (!invite) {
    return res.status(404).json({ message: "Invite not found" });
  }

  // Check if the invite is for the current user
  if (invite.userId !== session.user.id) {
    return res
      .status(401)
      .json({ message: "Unauthorized, this invitation is not for you" });
  }

  // Accept the invite
  const project = await prisma.project.update({
    where: {
      id: invite.projectId,
    },
    data: {
      members: {
        connect: {
          id: invite.userId,
        },
      },
    },
  });

  // Check if the project update was successful
  if (!project) {
    return res.status(500).json({ message: "Error while accepting invite" });
  }

  // Delete the invite
  const deletedInvite = await prisma.projectInvite.delete({
    where: {
      id: inviteId,
    },
  });

  // Check if the invite was deleted successfully
  if (!deletedInvite) {
    return res.status(500).json({ message: "Error while deleting invite" });
  }

  // Return the project
  return res.status(200).json(project);
};

/**
 * @swagger
 * /api/invites/{id}:
 *   delete:
 *     tags: [Invites]
 *     summary: Deletes an invitation
 *     description: Delete an invitation by ID. Only the invited user or project leader can delete it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the invitation to delete
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The invitation was successfully deleted
 *       400:
 *         description: The request URL is missing the invitation ID
 *       401:
 *         description: Unauthorized - user must be logged in, invited user or project leader
 *       404:
 *         description: The invitation was not found
 *       500:
 *         description: There was an error while deleting the invitation
 */

const deleteInvite = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  // Ensure session exists
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized, no active session" });
  }

  // Get the invite id from the url
  const inviteId = req.query.id as string;

  // Get the invite from the db
  const invite = await prisma.projectInvite.findUnique({
    where: {
      id: inviteId,
    },
    include: { project: true },
  });

  // Check if the invite exists
  if (!invite) {
    return res.status(404).json({ message: "Invite not found" });
  }

  // Check if the invite is for the current user or if the user is the project leader
  if (
    invite.userId !== session.user.id &&
    invite.project.leaderId !== session.user.id
  ) {
    return res.status(401).json({
      message:
        "Unauthorized, you do not have permission to delete this invitation",
    });
  }

  // Delete the invite
  const deletedInvite = await prisma.projectInvite.delete({
    where: {
      id: inviteId,
    },
  });

  // Check if the invite was deleted successfully
  if (!deletedInvite) {
    return res.status(500).json({ message: "Error while deleting invite" });
  }

  // Return success message
  return res.status(200).json({ message: "Invite successfully deleted" });
};

export default apiHandler({
  POST: { handler: acceptInvite },
  DELETE: { handler: deleteInvite },
});
