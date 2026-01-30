import { NextResponse } from "next/server";
import { UserModel } from "@/domain/models/User";
import { comparePassword } from "@/lib/password";
import { signToken } from "@/lib/session";
import { connectDB } from "@/db/connection";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await UserModel.findOne({ email, active: true });
  if (!user) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const token = signToken({
    id: user._id,
    role: user.role,
  });

  const res = NextResponse.json({ success: true });

  res.cookies.set("admin-token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res;
}
