import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

//DELETE api/projects/{id}
//GET api/projects/{id}

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Fetches a single project
 *     description: Fetch a project by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to fetch
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The project data
 *       400:
 *         description: The request URL is missing the project ID
 *       401:
 *         description: Unauthorized - user must be logged in
 *       404:
 *         description: The project was not found
 *       500:
 *         description: There was an error fetching the project
 */
const getProject = async (
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
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
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
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching project",
    });
  }
};

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     tags: [Projects]
 *     summary: Deletes a project
 *     description: Delete a project by ID. Only the leader of the project can delete it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to delete
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The project was successfully deleted
 *       400:
 *         description: The request URL is missing the project ID
 *       401:
 *         description: Unauthorized - user must be logged in
 *       403:
 *         description: Forbidden - user must be the leader of the project to delete it
 *       500:
 *         description: There was an error deleting the project
 */
const deleteProject = async (
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

  const user = session!.user;

  //find the project
  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    include: {
      leader: {
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  //check if the user is the leader of the project
  if (project?.leader.id !== user.id) {
    return res.status(403).json({
      message: "You are not authorized to delete this project",
    });
  }

  //delete the project
  try {
    await prisma.project.delete({
      where: {
        id,
      },
    });
    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error deleting project",
    });
  }
};

export default apiHandler({
  DELETE: { handler: deleteProject },
  GET: { handler: getProject },
});
