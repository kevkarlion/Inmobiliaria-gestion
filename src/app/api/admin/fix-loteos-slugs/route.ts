import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { PropertyModel } from "@/db/schemas/property.schema";
import slugify from "slugify";

import "@/domain/models/User";
import { PropertyTypeModel } from "@/domain/property-type/property-type.schema";

// POST /api/admin/fix-loteos-slugs
// Corregir slugs de loteos (quitar "loteo" del título si ya tiene tipo loteos)
export async function POST() {
  try {
    await connectDB();

    // Obtener tipo loteos
    const loteosType = await PropertyTypeModel.findOne({ slug: "loteos" });
    if (!loteosType) {
      return NextResponse.json({ error: "Tipo loteos no encontrado" }, { status: 404 });
    }

    // Obtener propiedades tipo loteos
    const properties = await PropertyModel.find({ propertyType: loteosType._id })
      .populate("address.city")
      .lean() as any[];

    console.log(`🔄 Corrigiendo ${properties.length} slugs de loteos...\n`);

    let updated = 0;
    const results: any[] = [];

    for (const prop of properties) {
      const oldSlug = prop.slug;
      const citySlug = (prop as any).address?.city?.slug;
      
      // Quitar "loteo" del título para evitar duplicado
      let cleanTitle = prop.title;
      if (cleanTitle.toLowerCase().startsWith("loteo ")) {
        cleanTitle = cleanTitle.substring(6); // quitar "loteo "
      } else if (cleanTitle.toLowerCase().startsWith("loteo-")) {
        cleanTitle = cleanTitle.substring(6); // quitar "loteo-"
      }

      const middle = slugify(cleanTitle, { lower: true, strict: true });
      const newSlug = `loteos-${middle}-${citySlug}`;

      // Verificar duplicados
      let finalSlug = newSlug;
      const existing = await PropertyModel.findOne({ slug: newSlug, _id: { $ne: prop._id } });
      
      if (existing) {
        let counter = 1;
        while (await PropertyModel.findOne({ slug: finalSlug })) {
          finalSlug = `${newSlug}-${counter}`;
          counter++;
        }
      }

      await PropertyModel.updateOne(
        { _id: prop._id },
        { $set: { slug: finalSlug, title: cleanTitle } }
      );

      if (oldSlug !== finalSlug) {
        updated++;
        results.push({ title: prop.title, newTitle: cleanTitle, oldSlug, newSlug: finalSlug });
        console.log(`  ✅ "${prop.title}" → "${cleanTitle}"`);
        console.log(`     ${oldSlug} → ${finalSlug}\n`);
      }
    }

    return NextResponse.json({ updated, results });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
