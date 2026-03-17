import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { ClientService } from "@/server/services/client.service";
import { AuditService } from "@/server/services/audit.service";
import { UpdateClientDTO } from "@/dtos/client/update-client.dto";
import { HttpError } from "@/server/errors/http-error";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/clients/[id] - Get client by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const client = await ClientService.findById(id);
    return NextResponse.json(client);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/clients/[id] - Update client
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const currentUser = await getCurrentUser();

    // Get existing client before update for audit
    const existingClient = await ClientService.findById(id);

    const dto = new UpdateClientDTO(body);
    const client = await ClientService.update(id, dto);

    // Audit log
    if (currentUser) {
      await AuditService.log({
        action: "update",
        entity: "client",
        entityId: id,
        userId: currentUser.id,
        userEmail: currentUser.email,
        description: `Cliente actualizado: ${existingClient.name}`,
        changes: { 
          name: { from: existingClient.name, to: client.name },
          id,
        },
      });
    }

    return NextResponse.json(client);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/clients/[id] - Delete client
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const currentUser = await getCurrentUser();
    
    // Get client info before deleting for audit log
    const existingClient = await ClientService.findById(id);
    
    const result = await ClientService.delete(id);

    // Audit log
    if (currentUser) {
      await AuditService.log({
        action: "delete",
        entity: "client",
        entityId: id,
        userId: currentUser.id,
        userEmail: currentUser.email,
        description: `Cliente eliminado: ${existingClient.name}`,
        changes: { name: existingClient.name, id },
      });
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
