import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export const GET = handle(async (req: NextRequest, { params }) => {
  await requireAdminUser(req);
  await connectDB();

  const user = await User.findOne({ _id: params.id }, { password: 0 });
  if (!user) {
    return NextResponse.json({ Message: "No users found." }, { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
});
