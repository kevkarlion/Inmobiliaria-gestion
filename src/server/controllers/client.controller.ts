import { connectDB } from "@/db/connection";
import { ClientService } from "../services/client.service";
import { AuditService } from "../services/audit.service";
import { NextResponse } from "next/server";
import { HttpError } from "@/server/errors/http-error";
import { QueryClientDTO } from "@/dtos/client/query-client.dto";
import { clientResponseDTO, ClientResponse } from "@/dtos/client/client-response.dto";
import { CreateClientDTO } from "@/dtos/client/create-client.dto";
import { UpdateClientDTO } from "@/dtos/client/update-client.dto";
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { requireAdmin, getCurrentUser as getAuthenticatedUser } from "@/lib/auth";

export class ClientController {
  private static handleError(error: unknown) {
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

  // POST /clients
  static async create(req: Request) {
    try {
      await connectDB();
      const currentUser = await getAuthenticatedUser();
      const body = await req.json();
      console.log("BODY RECIBIDO:", JSON.stringify(body, null, 2));

      // Agregar información del usuario actual al body
      if (currentUser) {
        body.createdBy = {
          userId: currentUser.id,
          email: currentUser.email,
        };
      }

      const dto = new CreateClientDTO(body);
      console.log("DTO CREADO - saleProperty:", JSON.stringify((dto as any).saleProperty, null, 2));
      
      const client = await ClientService.create(dto);
      console.log("CLIENTE CREADO - saleProperty:", JSON.stringify((client as any).saleProperty, null, 2));

      const response = clientResponseDTO(client);

      // Audit log
      if (currentUser) {
        await AuditService.log({
          action: "create",
          entity: "client",
          entityId: (client as any)._id.toString(),
          userId: currentUser.id,
          userEmail: currentUser.email,
          description: `Cliente creado: ${client.name}`,
          changes: { name: client.name, email: client.email },
        });
      }

      return NextResponse.json(response, { status: 201 });
    } catch (error: unknown) {
      console.error("🔴 ERROR EN CONTROLLER:", error);
      return this.handleError(error);
    }
  }

  // GET /clients
  static async getAll(req: Request) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);

      const rawQuery = Object.fromEntries(searchParams);
      const queryDto = new QueryClientDTO(rawQuery);

      const { items, meta } = await ClientService.findAll(queryDto);

      const responseItems: ClientResponse[] = items.map(clientResponseDTO);

      return NextResponse.json({
        items: responseItems,
        meta,
      });
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // GET /clients/:id
  static async getById({ params }: { params: { id: string } }) {
    try {
      await connectDB();
      const client = await ClientService.findById(params.id);
      return clientResponseDTO(client);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // PUT /clients/:id
  static async update(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const currentUser = await getAuthenticatedUser();
      const body = await req.json();

      const dto = new UpdateClientDTO(body);
      const existingClient = await ClientService.findById(params.id);

      const updatedClient = await ClientService.update(params.id, dto);

      // Audit log
      if (currentUser) {
        await AuditService.log({
          action: "update",
          entity: "client",
          entityId: params.id,
          userId: currentUser.id,
          userEmail: currentUser.email,
          description: `Cliente actualizado: ${existingClient.name}`,
          changes: { 
            name: { from: existingClient.name, to: updatedClient.name },
            id: params.id,
          },
        });
      }

      return NextResponse.json(clientResponseDTO(updatedClient));
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // DELETE /clients/:id
  static async delete(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const currentUser = await getAuthenticatedUser();
      const existingClient = await ClientService.findById(params.id);

      const result = await ClientService.delete(params.id);

      // Audit log
      if (currentUser) {
        await AuditService.log({
          action: "delete",
          entity: "client",
          entityId: params.id,
          userId: currentUser.id,
          userEmail: currentUser.email,
          description: `Cliente eliminado: ${existingClient.name}`,
          changes: { name: existingClient.name, id: params.id },
        });
      }

      return NextResponse.json(result);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // PATCH /clients/:id/status
  static async changeStatus(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const currentUser = await getAuthenticatedUser();
      const body = await req.json();

      const status = body.status as ClientStatus;
      if (!status || !Object.values(ClientStatus).includes(status)) {
        throw new HttpError("Estado inválido", 400);
      }

      const existingClient = await ClientService.findById(params.id);
      const client = await ClientService.changeStatus(params.id, status);

      // Audit log
      if (currentUser) {
        await AuditService.log({
          action: "update",
          entity: "client",
          entityId: params.id,
          userId: currentUser.id,
          userEmail: currentUser.email,
          description: `Estado de cliente actualizado: ${existingClient.name}`,
          changes: { 
            status: { from: existingClient.status, to: status },
            id: params.id,
          },
        });
      }

      return NextResponse.json(clientResponseDTO(client));
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // POST /clients/:id/notes
  static async addNote(req: Request, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const currentUser = await getAuthenticatedUser();
      const body = await req.json();

      const note = {
        type: body.type as "llamada" | "whatsapp" | "email" | "reunion" | "visita" | "nota",
        description: body.description,
        performedBy: body.performedBy,
      };

      if (!note.type || !note.description) {
        throw new HttpError("El tipo y la descripción son requeridos", 400);
      }

      const client = await ClientService.addNote(params.id, note);

      // Audit log
      if (currentUser) {
        await AuditService.log({
          action: "create",
          entity: "client",
          entityId: params.id,
          userId: currentUser.id,
          userEmail: currentUser.email,
          description: `Nota agregada al cliente: ${client.name}`,
          changes: { noteType: note.type, id: params.id },
        });
      }

      return NextResponse.json(clientResponseDTO(client));
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }
}
