import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { handle, validateBody } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export const runtime = "nodejs";

export const POST = handle(async (req: NextRequest) => {
  const body = await req.json();
  const { email, password, userName } = validateBody(registerSchema, body);

  await connectDB();

  const userExist = await User.findOne({ email });
  if (userExist) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }

  const userNameExist = await User.findOne({ userName });
  if (userNameExist) {
    return NextResponse.json(
      { error: "User name already exists" },
      { status: 400 },
    );
  }

  const userCreated = await User.create({ email, password, userName });

  return NextResponse.json(
    {
      user: userCreated,
      message: "User created successfully",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    },
    { status: 201 },
  );
});
