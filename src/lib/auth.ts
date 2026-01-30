/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/auth.ts
import { cookies } from "next/headers";
import { verifyToken } from "./session";

export async function requireAdmin() {
  const cookieStore = await cookies(); // ✅ ACÁ SÍ
  const token = cookieStore.get("admin-token")?.value;

  if (!token) return null;

  try {
    const decoded: any = verifyToken(token);
    if (decoded.role !== "admin") return null;
    return decoded;
  } catch {
    return null;
  }
}
