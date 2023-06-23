import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

type ApiMethodHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) => void | Promise<void>;

export interface IApiMethod {
  handler: ApiMethodHandler;
  requireAuth?: boolean;
}

export interface IApiHandler {
  GET?: IApiMethod;
  POST?: IApiMethod;
  PUT?: IApiMethod;
  DELETE?: IApiMethod;
  [key: string]: IApiMethod | undefined;
}

/**
 * API Handler Utility
 *
 * This utility simplifies the creation of Next.js API routes by providing a
 * consistent way to handle different HTTP methods, error handling, authenticating requests
 *
 * Usage:
 * Import the apiHandler function and pass an object containing handlers
 * for each HTTP method (GET, POST, PUT, DELETE) you want to support.
 * Each handler should be an object with a "handler" key, an optional "requireAuth" key
 *
 * @example
 * ```ts
 * export default apiHandler({
 *   GET: { handler: getHandler, requireAuth: true },
 *   POST: { handler: postHandler, requireAuth: false },
 *   PUT: { handler: putHandler, requireAuth: true },
 * });
 * ```
 */

export function apiHandler(handlers: IApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = handlers[req.method as string];

    // Get Session
    //I have no idea why but getSession only works if you remove the body from the request
    //so I'm doing that here and then adding it back in after
    const reqBody = req.body;
    let reqNoBody = req;
    reqNoBody.body = undefined;
    const session = await getSession({ req: reqNoBody });
    req.body = reqBody;

    // User Authentication
    if (method?.requireAuth !== false && (!session || !session.user)) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    // Method Validation
    if (!method) {
      res.setHeader("Allow", Object.keys(handlers));
      res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed`, success: false });
      return;
    }

    // Request Propogation
    try {
      await method.handler(req, res, session);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  };
}
