import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/contact";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await Contact.create(await req.json());
    return NextResponse.json(
      { Message: "Message sent successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ Message: "Message not sent" }, { status: 500 });
  }
}
