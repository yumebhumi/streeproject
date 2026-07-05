import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = new User(await req.json());
    await user.save();
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
