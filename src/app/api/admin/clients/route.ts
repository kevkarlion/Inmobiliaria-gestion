import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { ClientService } from "@/server/services/client.service";
import { CreateClientDTO } from "@/dtos/client/create-client.dto";
import { QueryClientDTO } from "@/dtos/client/query-client.dto";
import { ClientResponse } from "@/dtos/client/client-response.dto";
import { HttpError } from "@/server/errors/http-error";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/clients - List all clients with filters and pagination
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const rawQuery = Object.fromEntries(searchParams);
    const queryDto = new QueryClientDTO(rawQuery);

    const { items, meta } = await ClientService.findAll(queryDto);

    return NextResponse.json({
      items,
      meta,
    });
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

// POST /api/admin/clients - Create a new client
export async function POST(req: Request) {
  try {
    await connectDB();
    const currentUser = await getCurrentUser();
    console.log("=== CLIENT CREATE DEBUG ===");
    console.log("Current user:", currentUser);
    console.log("===========================");
    const body = await req.json();

    // Agregar información del usuario actual al body
    if (currentUser) {
      body.createdBy = {
        userId: currentUser.id,
        email: currentUser.email,
      };
    }

    // Normalize common enums to lowercase to align with DB schema
    if (body.preferences?.operationType) {
      body.preferences.operationType = String(body.preferences.operationType).toLowerCase();
    }
    if (body.status) {
      body.status = String(body.status).toLowerCase();
    }
    if (body.source) {
      body.source = String(body.source).toLowerCase();
    }

    const dto = new CreateClientDTO(body);
    const client = await ClientService.create(dto);

    return NextResponse.json(client, { status: 201 });
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
