import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { ClientController } from "@/server/controllers/client.controller";

export async function GET(req: Request) {
  await connectDB();
  // Delegates to existing controller (assumes getAll implementation exists)
  if (typeof ClientController?.getAll === "function") {
    return ClientController.getAll(req);
  }
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function POST(req: Request) {
  await connectDB();
  if (typeof ClientController?.create === "function") {
    return ClientController.create(req);
  }
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
