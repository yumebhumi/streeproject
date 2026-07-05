import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/contact";
import { handle, requireAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

export const DELETE = handle(async (req: NextRequest, { params }) => {
  await requireAdminUser(req);
  await connectDB();

  await Contact.deleteOne({ _id: params.id });
  return NextResponse.json(
    { Message: "Contact message deleted successfully." },
    { status: 200 },
  );
});
