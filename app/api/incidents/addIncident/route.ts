import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/models/incident";
import User from "@/models/user";
import { getAuthUser, handle } from "@/lib/auth";

export const runtime = "nodejs";

export const POST = handle(async (req: NextRequest) => {
  const authUser = await getAuthUser(req);
  const { location, description, category, date, time, name, isAnonymous } =
    await req.json();

  if (
    !location ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2
  ) {
    return NextResponse.json(
      { msg: "Latitude and longitude are required." },
      { status: 400 },
    );
  }

  if (
    typeof location.coordinates[0] !== "number" ||
    typeof location.coordinates[1] !== "number"
  ) {
    return NextResponse.json(
      { msg: "Latitude and longitude are required and must be numbers." },
      { status: 400 },
    );
  }

  if (!location.type || location.type !== "Point") {
    return NextResponse.json(
      { msg: 'Location type must be "Point".' },
      { status: 400 },
    );
  }

  await connectDB();
  const userId = await User.findById(authUser._id);
  if (!userId) {
    return NextResponse.json({ msg: "Invalid user ID" }, { status: 401 });
  }

  const shouldHideIdentity = Boolean(isAnonymous);
  const safeName = shouldHideIdentity
    ? ""
    : (name || userId.userName || "").trim();

  const newIncident = new Incident({
    location: {
      type: location.type,
      coordinates: [location.coordinates[0], location.coordinates[1]],
    },
    description,
    category,
    date,
    time,
    user: userId._id,
    name: safeName,
    isAnonymous: shouldHideIdentity,
    status: "submitted",
  });

  const incident = await newIncident.save();

  return NextResponse.json(
    { message: "Incident submitted for review.", incident },
    { status: 201 },
  );
});
