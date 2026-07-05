import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/contact";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export const GET = handle(async (req: NextRequest, { params }) => {
  await requireAdminUser(req);
  await connectDB();

  const contactMessage = await Contact.findOne({ _id: params.id });
  if (!contactMessage) {
    return NextResponse.json(
      { msg: "No contact message found." },
      { status: 404 },
    );
  }

  return NextResponse.json(contactMessage, { status: 200 });
});
