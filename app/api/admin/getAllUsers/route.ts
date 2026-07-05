import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export const GET = handle(async (req: NextRequest) => {
  await requireAdminUser(req);
  await connectDB();

  const users = await User.find({}, { password: 0 });
  if (!users || users.length === 0) {
    return NextResponse.json({ Message: "No users found." }, { status: 404 });
  }

  return NextResponse.json(users, { status: 200 });
});
