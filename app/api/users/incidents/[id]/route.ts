import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/models/incident";
import { getAuthUser, handle } from "@/lib/auth";

export const runtime = "nodejs";

export const PATCH = handle(
  async (req: NextRequest, { params }) => {
    const user = await getAuthUser(req);
    await connectDB();

    const incident = await Incident.findOneAndUpdate(
      { _id: params.id, user: user._id },
      await req.json(),
      { new: true },
    );

    if (!incident) {
      return NextResponse.json(
        { msg: "Incident not found or not authorized" },
        { status: 404 },
      );
    }

    return NextResponse.json(incident, { status: 200 });
  },
);

export const DELETE = handle(
  async (req: NextRequest, { params }) => {
    const user = await getAuthUser(req);
    await connectDB();

    const incident = await Incident.findOneAndDelete({
      _id: params.id,
      user: user._id,
    });

    if (!incident) {
      return NextResponse.json(
        { msg: "Incident not found or not authorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({ msg: "Incident deleted" }, { status: 200 });
  },
);
