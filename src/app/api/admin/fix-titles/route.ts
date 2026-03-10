import { NextResponse } from "next/server";
import { connectDB } from "@/db/connection";
import { PropertyModel } from "@/db/schemas/property.schema";
import slugify from "slugify";

// Importar modelos para registration
import "@/domain/models/User";
import { PropertyTypeModel } from "@/domain/property-type/property-type.schema";

// POST /api/admin/fix-titles
// Actualiza títulos y regenera slugs
export async function POST() {
  try {
    await connectDB();

    // Mapeo de títulos a cambiar
    const titleChanges: Record<string, string> = {
      "Casa la Martina": "La Martina",
      "Casa La Martina": "La Martina",
      "Casa en ph Atsa": "Ph Atsa",
      "Casa ph en pozo Atsa": "Ph en pozo Atsa",
      "Complejo Las Grutas": "Las Grutas",
      "Lote Don Mariano": "Don Mariano",
      "Lote El Mirador": "El Mirador",
      "Duplex Don Fernando": "Don Fernando",
      "Dúplex Don Fernando": "Don Fernando",
      "Departamentos en Pozo": "Departamentos en Pozo",
      "Departamentos en pozo": "Departamentos en Pozo",
      "Terreno Loteo San Sebastian": "Loteo San Sebastian",
      "Terreno Loteo San Sebastián": "Loteo San Sebastian",
      "Departamento Pecini": "Pecini",
      "Propiedad céntrica a reciclar": "Céntrica a reciclar",
    };

    console.log("🔄 Actualizando títulos y regenerando slugs...\n");

    const properties = await PropertyModel.find({}).lean() as any[];

    let updated = 0;
    const results: any[] = [];

    for (const property of properties) {
      const oldTitle = property.title;
      const newTitle = titleChanges[oldTitle] || oldTitle;
      
      // Obtener tipo y ciudad
      const propertyTypeDoc = await PropertyTypeModel.findById(property.propertyType).lean();
      const CityModel = (await import("@/db/schemas/city.schema")).City;
      const cityDoc = await CityModel.findById(property.address.city).lean();

      if (!propertyTypeDoc || !cityDoc) {
        results.push({ title: oldTitle, error: "Falta tipo o ciudad" });
        continue;
      }

      // Regenerar slug SIN duplicar el tipo
      const typeSlug = propertyTypeDoc.slug;
      const citySlug = cityDoc.slug;
      const middle = slugify(newTitle, { lower: true, strict: true });
      const newSlug = `${typeSlug}-${middle}-${citySlug}`;

      // Verificar duplicados
      let finalSlug = newSlug;
      const existing = await PropertyModel.findOne({ slug: newSlug, _id: { $ne: property._id } });
      
      if (existing) {
        let counter = 1;
        while (await PropertyModel.findOne({ slug: finalSlug })) {
          finalSlug = `${newSlug}-${counter}`;
          counter++;
        }
      }

      await PropertyModel.updateOne(
        { _id: property._id },
        { $set: { title: newTitle, slug: finalSlug } }
      );

      updated++;
      results.push({
        title: oldTitle,
        newTitle,
        slug: property.slug,
        newSlug: finalSlug
      });

      console.log(`  ✅ "${oldTitle}" → "${newTitle}"`);
      console.log(`     ${property.slug} → ${finalSlug}\n`);
    }

    return NextResponse.json({ 
      updated,
      results 
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
