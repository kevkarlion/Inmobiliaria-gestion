import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { ClientService } from "@/server/services/client.service";
import { AuditService } from "@/server/services/audit.service";
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { HttpError } from "@/server/errors/http-error";
import { getCurrentUser } from "@/lib/auth";

// PATCH /api/admin/clients/[id]/status - Change client status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const currentUser = await getCurrentUser();

    const status = body.status as ClientStatus;
    
    if (!status || !Object.values(ClientStatus).includes(status)) {
      throw new HttpError("Estado inválido", 400);
    }

    // Get existing client for audit
    const existingClient = await ClientService.findById(id);
    
    const client = await ClientService.changeStatus(id, status);

    // Audit log
    if (currentUser) {
      await AuditService.log({
        action: "update",
        entity: "client",
        entityId: id,
        userId: currentUser.id,
        userEmail: currentUser.email,
        description: `Estado de cliente actualizado: ${existingClient.name}`,
        changes: { 
          status: { from: existingClient.status, to: status },
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
