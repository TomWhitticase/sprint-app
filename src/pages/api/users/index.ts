import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

//GET /api/users - Get user list

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Fetch all users
 *     description: Fetch all users, supports pagination and search
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to return
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of users per page
 *       - in: query
 *         name: search_query
 *         schema:
 *           type: string
 *         description: The search query to filter users by name or email
 *      - in: query
 *         name: exclude
 *         schema:
 *           type: string[]
 *         description: user IDs to exclude from the results
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       401:
 *         description: Unauthorized - user must be logged in
 *       500:
 *         description: There was an error fetching the users
 */
const getUsers = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => {
  try {
    const { page = 1, limit = 10, search_query = "", exclude = "" } = req.query;

    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
      where: {
        OR: [
          {
            name: {
              contains: search_query as string,
            },
          },
          {
            email: {
              contains: search_query as string,
            },
          },
        ],
        NOT: {
          id: {
            in: (exclude as string).split(",") as string[],
          },
        },
      },
      skip: (+page - 1) * +limit,
      take: +limit,
    });

    return res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default apiHandler({
  GET: { handler: getUsers },
});
