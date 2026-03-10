import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { PropertyTypeModel } from "@/domain/property-type/property-type.schema";
import { PropertyModel } from "@/db/schemas/property.schema";

import "@/domain/models/User";

// GET /api/admin/manage-property-types
export async function GET() {
  try {
    await connectDB();

    // Ver tipos existentes
    const types = await PropertyTypeModel.find({}).lean();
    
    // Ver propiedades por tipo
    const propertiesByType = await PropertyModel.aggregate([
      { $group: { _id: "$propertyType", count: { $sum: 1 } } },
      { $lookup: { from: "propertytypes", localField: "_id", foreignField: "_id", as: "type" } },
      { $unwind: "$type" },
      { $project: { _id: 0, typeName: "$type.name", typeSlug: "$type.slug", count: 1 } }
    ]);

    return NextResponse.json({ 
      types: types.map(t => ({ id: t._id, name: t.name, slug: t.slug })),
      propertiesByType 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST /api/admin/manage-property-types
// Crear tipo "loteos" y migrar propiedades
export async function POST() {
  try {
    await connectDB();

    // 1. Verificar si ya existe "loteos"
    let loteosType = await PropertyTypeModel.findOne({ slug: "loteos" });
    
    if (!loteosType) {
      // Crear el tipo "loteos"
      loteosType = await PropertyTypeModel.create({ 
        name: "Loteos", 
        slug: "loteos", 
        active: true 
      });
      console.log("✅ Creado tipo: Loteos");
    }

    // 2. Encontrar propiedades que son loteos (títulos que contienen "loteo")
    const loteoProperties = await PropertyModel.find({
      title: { $regex: /loteo/i }
    }).lean() as any[];

    console.log(`🔍 Encontradas ${loteoProperties.length} propiedades con "loteo" en el título`);

    // 3. Migrar esas propiedades al tipo "loteos"
    let migrated = 0;
    for (const prop of loteoProperties) {
      await PropertyModel.updateOne(
        { _id: prop._id },
        { $set: { propertyType: loteosType._id } }
      );
      migrated++;
    }

    // 4. Regenerar slugs para las propiedades migradas
    const { default: slugify } = await import("slugify");
    const CityModel = (await import("@/db/schemas/city.schema")).City;

    const updatedProperties = await PropertyModel.find({
      title: { $regex: /loteo/i }
    }).populate("propertyType").populate("address.city").lean() as any[];

    for (const prop of updatedProperties) {
      const typeSlug = (prop as any).propertyType?.slug;
      const citySlug = (prop as any).address?.city?.slug;
      const middle = slugify(prop.title, { lower: true, strict: true });
      const newSlug = `${typeSlug}-${middle}-${citySlug}`;

      await PropertyModel.updateOne(
        { _id: prop._id },
        { $set: { slug: newSlug } }
      );
    }

    return NextResponse.json({ 
      message: "Migración completada",
      loteosType: { name: loteosType.name, slug: loteosType.slug },
      migrated,
      updatedSlugs: updatedProperties.length
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
