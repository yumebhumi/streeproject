import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident, { IncidentStatus } from "@/models/incident";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

const INCIDENT_STATUSES: IncidentStatus[] = [
  "submitted",
  "published",
  "rejected",
];

export const PATCH = handle(async (req: NextRequest, { params }) => {
  await requireAdminUser(req);

  const { status } = await req.json();

  if (!INCIDENT_STATUSES.includes(status)) {
    return NextResponse.json(
      { msg: "Invalid incident status." },
      { status: 400 },
    );
  }

  await connectDB();
  const updatedIncident = await Incident.findByIdAndUpdate(
    params.id,
    { $set: { status } },
    { new: true },
  ).populate("user", "userName email");

  if (!updatedIncident) {
    return NextResponse.json({ msg: "No incident found." }, { status: 404 });
  }

  return NextResponse.json(updatedIncident, { status: 200 });
});
