import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { ClientService } from "@/server/services/client.service";
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { HttpError } from "@/server/errors/http-error";

// PATCH /api/admin/clients/[id]/status - Change client status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const status = body.status as ClientStatus;
    
    if (!status || !Object.values(ClientStatus).includes(status)) {
      throw new HttpError("Estado inválido", 400);
    }

    const client = await ClientService.changeStatus(id, status);
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
