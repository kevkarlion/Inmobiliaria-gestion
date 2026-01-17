import { connectDB } from "@/db/connection";

export async function GET() {
  await connectDB();
  return Response.json({ status: "ok", db: "connected" });
}
