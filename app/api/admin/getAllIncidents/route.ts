import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/models/incident";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export const GET = handle(async (req: NextRequest) => {
  await requireAdminUser(req);
  await connectDB();

  const incidents = await Incident.find()
    .populate("user", "userName email")
    .sort({ createdAt: -1 });

  return NextResponse.json(incidents, { status: 200 });
});
