import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { ClientService } from "@/server/services/client.service";
import { HttpError } from "@/server/errors/http-error";

// POST /api/admin/clients/[id]/notes - Add a note to client
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const { type, description, performedBy } = body;

    if (!type || !description) {
      throw new HttpError("El tipo y la descripción son requeridos", 400);
    }

    const validTypes = ["llamada", "whatsapp", "email", "reunion", "visita", "nota"];
    if (!validTypes.includes(type)) {
      throw new HttpError("Tipo de interacción inválido", 400);
    }

    const client = await ClientService.addNote(id, {
      type,
      description,
      performedBy,
    });

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
