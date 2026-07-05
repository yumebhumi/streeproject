import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export const DELETE = handle(async (req: NextRequest, { params }) => {
  await requireAdminUser(req);
  await connectDB();

  await User.deleteOne({ _id: params.id });
  return NextResponse.json(
    { Message: "User deleted successfully." },
    { status: 200 },
  );
});
