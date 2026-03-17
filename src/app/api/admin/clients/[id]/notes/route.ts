import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { ClientService } from "@/server/services/client.service";
import { AuditService } from "@/server/services/audit.service";
import { HttpError } from "@/server/errors/http-error";
import { getCurrentUser } from "@/lib/auth";

// POST /api/admin/clients/[id]/notes - Add a note to client
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const currentUser = await getCurrentUser();

    const { type, description, performedBy } = body;

    if (!type || !description) {
      throw new HttpError("El tipo y la descripción son requeridos", 400);
    }

    const validTypes = ["llamada", "whatsapp", "email", "reunion", "visita", "nota"];
    if (!validTypes.includes(type)) {
      throw new HttpError("Tipo de interacción inválido", 400);
    }

    // Get client for audit
    const existingClient = await ClientService.findById(id);
    
    const client = await ClientService.addNote(id, {
      type,
      description,
      performedBy,
    });

    // Audit log
    if (currentUser) {
      await AuditService.log({
        action: "create",
        entity: "client",
        entityId: id,
        userId: currentUser.id,
        userEmail: currentUser.email,
        description: `Nota agregada al cliente: ${existingClient.name}`,
        changes: { noteType: type, id },
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
