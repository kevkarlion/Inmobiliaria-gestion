import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { PropertyTypeModel } from "@/domain/property-type/property-type.schema";
import { PropertyModel } from "@/db/schemas/property.schema";

import "@/domain/models/User";

// POST /api/admin/create-departamento-en-pozo
// Crear tipo "departamento-en-pozo" y migrar propiedades existentes
export async function POST() {
  try {
    await connectDB();

    // 1. Verificar si ya existe
    let deptPozoType = await PropertyTypeModel.findOne({ slug: "departamento-en-pozo" });
    
    if (!deptPozoType) {
      deptPozoType = await PropertyTypeModel.create({ 
        name: "Departamento en Pozo", 
        slug: "departamento-en-pozo", 
        active: true 
      });
      console.log("✅ Creado tipo: Departamento en Pozo");
    }

    // 2. Encontrar propiedades que son departamentos en pozo
    const pozoProperties = await PropertyModel.find({
      title: { $regex: /pozo/i },
      propertyType: { $ne: deptPozoType._id }
    }).lean() as any[];

    console.log(`🔍 Encontradas ${pozoProperties.length} propiedades con "pozo" en el título`);

    // 3. Migrar esas propiedades al tipo "departamento-en-pozo"
    let migrated = 0;
    for (const prop of pozoProperties) {
      // Quitar "departamento en pozo" del título para evitar duplicado
      let cleanTitle = prop.title;
      if (cleanTitle.toLowerCase().startsWith("departamento en pozo ")) {
        cleanTitle = cleanTitle.substring(24); // quitar "departamento en pozo "
      } else if (cleanTitle.toLowerCase().startsWith("departamento en pozo-")) {
        cleanTitle = cleanTitle.substring(24);
      } else if (cleanTitle.toLowerCase().startsWith("dept en pozo ")) {
        cleanTitle = cleanTitle.substring(13);
      }

      await PropertyModel.updateOne(
        { _id: prop._id },
        { $set: { propertyType: deptPozoType._id, title: cleanTitle } }
      );
      migrated++;
    }

    // 4. Regenerar slugs
    const { default: slugify } = await import("slugify");
    const CityModel = (await import("@/db/schemas/city.schema")).City;

    const updatedProperties = await PropertyModel.find({
      title: { $regex: /pozo/i },
      propertyType: deptPozoType._id
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
      deptPozoType: { name: deptPozoType.name, slug: deptPozoType.slug },
      migrated,
      updatedSlugs: updatedProperties.length
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
