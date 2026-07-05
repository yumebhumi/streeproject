import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User, { UserDocument } from "@/models/user";

/**
 * Error that carries an HTTP status and a JSON body. Thrown by auth helpers and
 * caught by `handle()` so route handlers return consistent responses.
 */
export class HttpError extends Error {
  status: number;
  body: Record<string, unknown>;

  constructor(status: number, body: Record<string, unknown>) {
    super(typeof body.error === "string" ? body.error : "Request error");
    this.status = status;
    this.body = body;
  }
}

interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

/**
 * Replaces the Express `authMiddleware`. Verifies the Bearer token and returns
 * the matching user document (without the password). Throws `HttpError(401)`.
 */
export async function getAuthUser(req: NextRequest): Promise<UserDocument> {
  const token = req.headers.get("authorization");

  if (!token) {
    throw new HttpError(401, { error: "Unauthorized, no token" });
  }

  try {
    const jwtToken = token.replace("Bearer", "").trim();
    const isVerified = jwt.verify(
      jwtToken,
      process.env.JWT_SECRET_KEY as string,
    ) as JwtPayload;

    await connectDB();
    const userData = await User.findOne({ email: isVerified.email }).select({
      password: 0,
    });

    if (!userData) {
      throw new HttpError(401, { error: "Unauthorized" });
    }

    return userData;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(401, { error: "Unauthorized" });
  }
}

/**
 * Replaces the Express `adminMiddleware`. Throws `HttpError(403)` if the user is
 * not an admin.
 */
export function requireAdmin(user: UserDocument): void {
  if (!user.isAdmin) {
    throw new HttpError(403, { Message: "Unauthorized, user is not an admin!" });
  }
}

/**
 * Convenience for admin-only routes: authenticate then assert admin. Mirrors the
 * `authMiddleware` + `adminMiddleware` chain in the original Express routes.
 */
export async function requireAdminUser(req: NextRequest): Promise<UserDocument> {
  const user = await getAuthUser(req);
  requireAdmin(user);
  return user;
}

/**
 * Validate a request body against a zod schema, mirroring the original
 * `validateMiddleware` (HTTP 422 with per-issue messages).
 */
export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    const extraDetails = result.error.issues.map((issue) => issue.message);
    throw new HttpError(422, {
      message: "Fill the input properly",
      extraDetails,
    });
  }
  return result.data;
}

type RouteHandler = (
  req: NextRequest,
  context: { params: Record<string, string> },
) => Promise<NextResponse> | NextResponse;

/**
 * Wraps a route handler so thrown `HttpError`s (and unexpected errors) become
 * JSON responses with the right status code.
 */
export function handle(fn: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      return await fn(req, context);
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json(error.body, { status: error.status });
      }
      console.error(error);
      return NextResponse.json(
        { message: "Backend Error", extraDetails: "Error from the Backend" },
        { status: 500 },
      );
    }
  };
}
