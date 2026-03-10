import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { PropertyModel } from "@/db/schemas/property.schema";
import slugify from "slugify";

// GET /api/admin/fix-slugs
// Ejecutar para regenerar TODOS los slugs al formato: tipo-titulo-ciudad
export async function GET() {
  try {
    await connectDB();

    console.log("🔧 Regenerando TODOS los slugs al nuevo formato...");

    // Encontrar TODAS las propiedades (sin filtro de status)
    const properties = await PropertyModel.find({}).lean() as any[];

    console.log(`📊 Total de propiedades: ${properties.length}`);

    let fixedCount = 0;
    const errors: string[] = [];
    const fixed: { id: string; oldSlug: string; newSlug: string }[] = [];

    for (const property of properties) {
      console.log(`\n🔄 Procesando: ${property.title}`);
      console.log(`   Slug actual: ${property.slug}`);

      // Obtener los slugs de tipo y ciudad
      const propertyTypeDoc = await import("@/domain/property-type/property-type.schema").then(m => 
        m.PropertyTypeModel.findById(property.propertyType).lean()
      );
      
      const cityDoc = await import("@/db/schemas/city.schema").then(m =>
        m.City.findById(property.address.city).lean()
      );

      if (!propertyTypeDoc || !cityDoc) {
        const error = `❌ ERROR: Falta tipo o ciudad para ${property.title}`;
        console.log(error);
        errors.push(error);
        continue;
      }

      const typeSlug = propertyTypeDoc.slug;
      const citySlug = cityDoc.slug;
      const middle = slugify(property.title, { lower: true, strict: true });
      const newSlug = `${middle}-${citySlug}`;

      console.log(`   → Nuevo slug: ${newSlug}`);

      // Si no cambió, continuar
      if (newSlug === property.slug) {
        console.log(`   ✅ Ya tiene el formato correcto`);
        continue;
      }

      // Verificar duplicados
      let finalSlug = newSlug;
      const existingWithNewSlug = await PropertyModel.findOne({ slug: newSlug });
      
      if (existingWithNewSlug && existingWithNewSlug._id.toString() !== property._id.toString()) {
        console.log(`   ⚠️  El slug ya existe, generando con counter...`);
        let counter = 1;
        while (await PropertyModel.findOne({ slug: finalSlug })) {
          finalSlug = `${newSlug}-${counter}`;
          counter++;
        }
        console.log(`   → Slug final: ${finalSlug}`);
      }
      
      await PropertyModel.updateOne(
        { _id: property._id },
        { $set: { slug: finalSlug } }
      );

      fixedCount++;
      fixed.push({ id: property._id.toString(), oldSlug: property.slug, newSlug: finalSlug });
    }

    const result = {
      total: properties.length,
      fixed: fixedCount,
      errors: errors.length,
      fixedDetails: fixed,
      errorDetails: errors,
    };

    console.log("\n" + "=".repeat(50));
    console.log("📈 RESUMEN:", result);
    console.log("=".repeat(50));

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
