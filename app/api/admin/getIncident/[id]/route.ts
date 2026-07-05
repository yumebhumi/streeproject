import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/models/incident";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export const GET = handle(async (req: NextRequest, { params }) => {
  await requireAdminUser(req);
  await connectDB();

  const incident = await Incident.findOne({ _id: params.id });
  if (!incident) {
    return NextResponse.json({ msg: "No incident found." }, { status: 404 });
  }

  return NextResponse.json(incident, { status: 200 });
});
