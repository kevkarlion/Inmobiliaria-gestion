import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  
  return NextResponse.json({
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + "..." : null,
    cookies: Array.from(cookieStore.getAll()).map(c => c.name),
  });
}
