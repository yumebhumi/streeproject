import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export const PATCH = handle(async (req: NextRequest, { params }) => {
  await requireAdminUser(req);
  await connectDB();

  const updatedData = await User.updateOne(
    { _id: params.id },
    { $set: await req.json() },
  );

  return NextResponse.json({ Success: updatedData }, { status: 200 });
});
