
import { connectDB } from "@/db/connection";
import { PropertyService } from "../services/property.service";
import { NextResponse } from "next/server";
import { HttpError } from "@/server/errors/http-error";
import { QueryPropertyDTO } from "@/dtos/property/query-property.dto";
import {
  propertyResponseDTO,
  PropertyResponse,
} from "@/dtos/property/property-response.dto";
import { CreatePropertyDTO } from "@/dtos/property/create-property.dto";
import { UpdatePropertyDTO } from "@/dtos/property/update-property.dto";

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
      const body = await req.json();

      const dto = new CreatePropertyDTO(body);
      const property = await PropertyService.create(dto);
      console.log('property',property)
      const response = propertyResponseDTO(property);
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

      const { items, meta } = await PropertyService.findAll(queryDto);

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
      const body = await req.json();
      const dto = new UpdatePropertyDTO(body);

      const updatedProperty = await PropertyService.update(params.slug, dto);

      return NextResponse.json(propertyResponseDTO(updatedProperty));
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // DELETE /properties/:slug
  static async delete(req: Request, { params }: { params: { slug: string } }) {
    try {
      await connectDB();
      const result = await PropertyService.delete(params.slug);
      return NextResponse.json(result);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }
}
