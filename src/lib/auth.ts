/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/auth.ts
import { cookies, headers } from "next/headers";
import { verifyToken } from "./session";

export async function requireAdmin() {
  // Try cookie first
  const cookieStore = await cookies();
  let token = cookieStore.get("admin_token")?.value;
  
  // If no cookie, try Authorization header (Bearer token)
  if (!token) {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  console.log("=== AUTH DEBUG ===");
  console.log("Token found:", token ? "yes" : "no");
  console.log("==================");

  if (!token) return null;

  try {
    const decoded: any = verifyToken(token);
    console.log("Decoded token:", decoded);
    if (decoded.role !== "admin") return null;
    return decoded;
  } catch (e) {
    console.log("Token verification error:", e);
    return null;
  }
}

/**
 * Retorna el usuario actual sin importar su rol (admin o user)
 */
export async function getCurrentUser() {
  // Try cookie first
  const cookieStore = await cookies();
  let token = cookieStore.get("admin_token")?.value;
  
  // If no cookie, try Authorization header (Bearer token)
  if (!token) {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  try {
    const decoded: any = verifyToken(token);
    return decoded;
  } catch (e) {
    return null;
  }
}
