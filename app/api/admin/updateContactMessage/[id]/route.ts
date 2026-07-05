import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/contact";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export const PATCH = handle(async (req: NextRequest, { params }) => {
  await requireAdminUser(req);
  await connectDB();

  const updatedData = await Contact.updateOne(
    { _id: params.id },
    { $set: await req.json() },
  );

  return NextResponse.json(updatedData, { status: 200 });
});
