import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Sesión cerrada" });

  // Borramos la cookie seteándola con una fecha de expiración pasada
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // Esto la elimina instantáneamente
    path: "/",
  });

  return response;
}