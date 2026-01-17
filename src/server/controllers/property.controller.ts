import { connectDB } from "@/db/connection";
import { PropertyService } from "../services/property.service";
import { NextResponse } from "next/server";

export class PropertyController {
  static async create(req: Request) {
    await connectDB();
    const body = await req.json();

    const property = await PropertyService.create(body);

    return NextResponse.json(property, { status: 201 });
  }

  static async getAll(req: Request) {
    const { searchParams } = new URL(req.url);

    const properties = await PropertyService.findAll(
      Object.fromEntries(searchParams),
    );

    return NextResponse.json(properties);
  }



  static async getBySlug(
    req: Request,
    { params }: { params: { slug: string } },
  ) {
    await connectDB();
    const property = await PropertyService.findBySlug(params.slug);
    return NextResponse.json(property);
  }
}
