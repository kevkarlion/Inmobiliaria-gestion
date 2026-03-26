
import { connectDB } from "@/db/connection";
import { PropertyService } from "../services/property.service";
import { AuditService } from "../services/audit.service";
import { NextResponse } from "next/server";
import { HttpError } from "@/server/errors/http-error";
import { QueryPropertyDTO } from "@/dtos/property/query-property.dto";
import {
  propertyResponseDTO,
  PropertyResponse,
} from "@/dtos/property/property-response.dto";
import { CreatePropertyDTO } from "@/dtos/property/create-property.dto";
import { UpdatePropertyDTO } from "@/dtos/property/update-property.dto";
import { requireAdmin, getCurrentUser as getAuthenticatedUser } from "@/lib/auth";

export class PropertyController {
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

  // POST /properties
  static async create(req: Request) {
    try {
      await connectDB();
      const currentUser = await getAuthenticatedUser();
      console.log("=== PROPERTY CREATE DEBUG ===");
      console.log("Current user:", currentUser);
      console.log("=============================");
      const body = await req.json();

      // Agregar información del usuario actual al body
      if (currentUser) {
        body.createdBy = {
          userId: currentUser.id,
          email: currentUser.email,
        };
      }

      const dto = new CreatePropertyDTO(body);
      const property = await PropertyService.create(dto);
      
      const response = propertyResponseDTO(property);

      // Audit log
      if (currentUser) {
        await AuditService.log({
          action: "create",
          entity: "property",
          entityId: property._id.toString(),
          userId: currentUser.id,
          userEmail: currentUser.email,
          description: `Propiedad creada: ${property.title}`,
          changes: { title: property.title, slug: property.slug },
        });
      }

      return NextResponse.json(response, { status: 201 });
    } catch (error: unknown) {
      console.error("🔴 ERROR EN CONTROLLER:", error);
      return this.handleError(error);
    }
  }

  // GET /properties
  static async getAll(req: Request) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);

      const rawQuery = Object.fromEntries(searchParams);
      const queryDto = new QueryPropertyDTO(rawQuery);

      // Handle filter parameter for admin views
      const filterParam = searchParams.get("filter");
      
      // Get current user
      const currentUser = await getAuthenticatedUser();
      
      // If filter is "mine" or a specific user ID, apply user filter
      if (filterParam && filterParam !== "all") {
        if (filterParam === "mine" && currentUser) {
          // User wants their own properties - use their ID
          queryDto.filters.userId = currentUser.id;
        } else if (filterParam !== "mine") {
          // Admin filtering by specific user ID
          queryDto.filters.userId = filterParam;
        }
      }

      const { items, meta } = await PropertyService.findAll(queryDto, currentUser);

      const responseItems: PropertyResponse[] =
        items.map(propertyResponseDTO);

      return NextResponse.json({
        items: responseItems,
        meta,
      });
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // GET /properties/:slug
  static async getBySlug(slug: string) {
    try {
      await connectDB();
      const property = await PropertyService.findBySlug(slug);
      return propertyResponseDTO(property);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // PUT /properties/:slug
  static async update(req: Request, { params }: { params: { slug: string } }) {
    try {
      await connectDB();
      const currentUser = await getAuthenticatedUser();
      const body = await req.json();
      
      const dto = new UpdatePropertyDTO(body);
      const existingProperty = await PropertyService.findBySlug(params.slug);

      // Verificar permisos: solo el admin o el propietario puede editar
      const isOwner = currentUser && existingProperty.createdBy?.userId === currentUser.id;
      const isAdmin = currentUser?.role === "admin" || currentUser?.isAdmin;
      
      if (!currentUser || (!isOwner && !isAdmin)) {
        return NextResponse.json(
          { message: "No tenés permisos para editar esta propiedad" },
          { status: 403 }
        );
      }

      const updatedProperty = await PropertyService.update(params.slug, dto);

      // Audit log
      if (currentUser) {
        await AuditService.log({
          action: "update",
          entity: "property",
          entityId: existingProperty._id.toString(),
          userId: currentUser.id,
          userEmail: currentUser.email,
          description: `Propiedad actualizada: ${existingProperty.title}`,
          changes: { 
            title: { from: existingProperty.title, to: updatedProperty.title },
            slug: params.slug,
          },
        });
      }

      return NextResponse.json(propertyResponseDTO(updatedProperty));
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // DELETE /properties/:slug
  static async delete(req: Request, { params }: { params: { slug: string } }) {
    try {
      await connectDB();
      const currentUser = await getAuthenticatedUser();
      const existingProperty = await PropertyService.findBySlug(params.slug);

      // Verificar permisos: solo el admin o el propietario puede eliminar
      const isOwner = currentUser && existingProperty.createdBy?.userId === currentUser.id;
      const isAdmin = currentUser?.role === "admin" || currentUser?.isAdmin;
      
      if (!currentUser || (!isOwner && !isAdmin)) {
        return NextResponse.json(
          { message: "No tenés permisos para eliminar esta propiedad" },
          { status: 403 }
        );
      }

      const result = await PropertyService.delete(params.slug);

      // Audit log
      if (currentUser) {
        await AuditService.log({
          action: "delete",
          entity: "property",
          entityId: existingProperty._id.toString(),
          userId: currentUser.id,
          userEmail: currentUser.email,
          description: `Propiedad eliminada: ${existingProperty.title}`,
          changes: { title: existingProperty.title, slug: params.slug },
        });
      }

      return NextResponse.json(result);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }
}
