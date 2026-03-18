import { NextResponse } from "next/server";
import { UserModel } from "@/domain/models/User";
import { comparePassword } from "@/lib/password";
import { signToken } from "@/lib/session";
import { connectDB } from "@/db/connection";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await UserModel.findOne({ email, active: true });
  if (!user) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });

  const ok = await comparePassword(password, user.password);
  if (!ok) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });

  // Allow both admin and user roles to login
  // Admin gets full access, users get limited access
  const token = signToken({ id: user._id.toString(), role: user.role, email: user.email });

  const res = NextResponse.json({ 
    success: true,
    user: { id: user._id, email: user.email, role: user.role },
    token: token, // Send token in body for fallback
  });

  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return res;
}
