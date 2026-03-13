import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { ClientController } from "@/server/controllers/client.controller";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  // Attempt to delegate to existing controller's getById if available
  if (typeof (ClientController as any)?.getById === "function") {
    return (ClientController as any).getById({ params: { id } } as any);
  }
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (typeof (ClientController as any)?.update === "function") {
    return (ClientController as any).update(req, { params: { id } } as any);
  }
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (typeof (ClientController as any)?.delete === "function") {
    return (ClientController as any).delete(req, { params: { id } } as any);
  }
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
