import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { handle, validateBody } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export const runtime = "nodejs";

export const POST = handle(async (req: NextRequest) => {
  const body = await req.json();
  const { userName, password } = validateBody(loginSchema, body);

  await connectDB();
  const userExist = await User.findOne({ userName });

  if (!userExist) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const isMatch = await bcrypt.compare(password, userExist.password);

  if (isMatch) {
    return NextResponse.json(
      {
        message: "Login Successful!",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    { error: "Invalid user name or password!" },
    { status: 401 },
  );
});
