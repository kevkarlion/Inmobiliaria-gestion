import { connectDB } from "@/db/connection";
import { PropertyService } from "../services/property.service";
import { NextResponse } from "next/server";
import { HttpError } from "@/server/errors/http-error";

export class PropertyController {

  private static handleError(error: any) {
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




    static async create(req: Request) {
    try {
      await connectDB();

      const body = await req.json();
      const property = await PropertyService.create(body);

      return NextResponse.json(property, { status: 201 });
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  

  static async getAll(req: Request) {
    try {
      await connectDB();

      const { searchParams } = new URL(req.url);
      const properties = await PropertyService.findAll(
        Object.fromEntries(searchParams),
      );

      return NextResponse.json(properties);
    } catch (error: any) {
      return PropertyController.handleError(error);
    }
  }

  static async getBySlug(
    req: Request,
    { params }: { params: { slug: string } },
  ) {
    try {
      await connectDB();

      const property = await PropertyService.findBySlug(params.slug);
      return NextResponse.json(property);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
}
