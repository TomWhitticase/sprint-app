import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

//POST api/projects - create a new project
//GET api/projects - get all projects i belong to

//TODO update the doc for archived

/**
 * @swagger
 * /api/projects:
 *   post:
 *     tags: [Projects]
 *     summary: Creates a new project
 *     description: Create a new project with the current user as the leader and member
 *     parameters:
 *       - in: body
 *         name: project
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The project was successfully created
 *       400:
 *         description: The request body is missing required fields
 *       401:
 *         description: Unauthorized - user must be logged in
 *       500:
 *         description: There was an error creating the project
 */
const createProject = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const { name, description } = req.body;
  const user = session!.user;

  if (!name) {
    return res.status(400).json({
      message: "Project name is required",
      success: false,
    });
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description: description ?? "",
        leader: {
          connect: {
            id: user.id,
          },
        },
        members: {
          connect: {
            id: user.id,
          },
        },
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
    return res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating project",
      success: false,
    });
  }
};

/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags: [Projects]
 *     summary: Fetch all projects for the current user
 *     description: Fetch all projects where the current user is a leader or a member
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: The role of the user in the projects to return (leader, member)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of projects
 *       401:
 *         description: Unauthorized - user must be logged in
 *       500:
 *         description: There was an error fetching the projects
 */
const getProjects = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  const user = session!.user;

  //get query params
  const role = typeof req.query.role === "string" ? req.query.role : undefined;

  try {
    let projects;
    switch (role) {
      case "leader":
        projects = await prisma.project.findMany({
          where: { leaderId: user.id, archived: false },
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
            tasks: true,
            posts: true,
            resources: true,
          },
        });
        break;
      case "member":
        projects = await prisma.project.findMany({
          where: { members: { some: { id: user.id } }, archived: false },
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
            tasks: true,
            posts: true,
            resources: true,
          },
        });
        break;
      default:
        projects = await prisma.project.findMany({
          where: {
            OR: [{ leaderId: user.id }, { members: { some: { id: user.id } } }],
            archived: false,
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
            tasks: true,
            posts: true,
            resources: true,
          },
        });
    }

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching projects",
      success: false,
    });
  }
};

export default apiHandler({
  POST: { handler: createProject },
  GET: { handler: getProjects },
});
