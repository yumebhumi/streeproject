import { NextResponse } from "next/server";
import { handle } from "@/lib/auth";

export const runtime = "nodejs";

export const GET = handle(async () => {
  return new NextResponse("Hello World from controller!", { status: 200 });
});
