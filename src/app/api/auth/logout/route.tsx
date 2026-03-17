import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Force clear all cookies first
  const cookieStore = await cookies();
  const response = NextResponse.json({ success: true, message: "Sesión cerrada" });

  // Clear admin_token cookie
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  console.log("Cookies before logout:", cookieStore.getAll().map(c => c.name));
  
  return response;
}

// Also allow GET for debugging
export async function GET() {
  const cookieStore = await cookies();
  return NextResponse.json({
    cookies: cookieStore.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + "..." }))
  });
}
