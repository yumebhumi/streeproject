import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/contact";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export const GET = handle(async (req: NextRequest) => {
  await requireAdminUser(req);
  await connectDB();

  const contactMessages = await Contact.find();
  return NextResponse.json(contactMessages, { status: 200 });
});
