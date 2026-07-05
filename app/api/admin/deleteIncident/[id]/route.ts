import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/models/incident";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export const DELETE = handle(async (req: NextRequest, { params }) => {
  await requireAdminUser(req);
  await connectDB();

  await Incident.deleteOne({ _id: params.id });
  return NextResponse.json(
    { Message: "Incident deleted successfully." },
    { status: 200 },
  );
});
