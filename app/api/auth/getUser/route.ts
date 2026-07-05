import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, handle } from "@/lib/auth";

export const runtime = "nodejs";

export const GET = handle(async (req: NextRequest) => {
  const userData = await getAuthUser(req);
  return NextResponse.json({ userData }, { status: 200 });
});
