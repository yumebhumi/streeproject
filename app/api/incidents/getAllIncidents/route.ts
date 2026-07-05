import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/models/incident";
import { getAuthUser, handle } from "@/lib/auth";

export const runtime = "nodejs";

export const GET = handle(async (req: NextRequest) => {
  await getAuthUser(req);
  await connectDB();

  const incidents = await Incident.find({ status: "published" }).sort({
    date: -1,
    time: -1,
  });

  return NextResponse.json(incidents, { status: 200 });
});
