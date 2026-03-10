import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { PropertyModel } from "@/db/schemas/property.schema";
import { PropertyTypeModel } from "@/domain/property-type/property-type.schema";
import { City } from "@/db/schemas/city.schema";

// Force model registration
import "@/domain/models/User";

// GET /api/admin/list-titles
export async function GET() {
  try {
    await connectDB();

    const properties = await PropertyModel.find({})
      .populate("propertyType", "name slug")
      .populate("address.city", "name slug")
      .select("title slug propertyType address.city")
      .lean() as any[];

    const result = properties.map(p => ({
      id: p._id.toString(),
      title: p.title,
      type: (p as any).propertyType?.name,
      typeSlug: (p as any).propertyType?.slug,
      city: (p as any).address?.city?.name,
      citySlug: (p as any).address?.city?.slug,
      slug: p.slug,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
