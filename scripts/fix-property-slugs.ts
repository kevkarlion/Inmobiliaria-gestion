/**
 * Script de migración para corregir slugs de propiedades mal formados.
 * 
 * Problema: Algunas propiedades tienen slugs como "propiedad-centrica-a-reciclar"
 * que deberían ser "casa-propiedad-centrica-a-reciclar-general-roca"
 * 
 * Ejecución: npx tsx scripts/fix-property-slugs.ts
 */

import { connectDB } from "@/db/connection";
import { PropertyModel } from "@/db/schemas/property.schema";
import { PropertyTypeModel } from "@/domain/property-type/property-type.schema";
import { City } from "@/db/schemas/city.schema";
import { Province } from "@/db/schemas/province.schema";
import { Barrio } from "@/db/schemas/barrio.schema";
import slugify from "slugify";

// Import de User para asegurar registro del modelo (si aplica)
// No es necesario para este script, pero fuerza carga de configuraciones
import "@/domain/models/User";

const EXPECTED_PARTS = 3; // tipo-titulo-ciudad

interface PropertyDoc {
  _id: any;
  title: string;
  slug: string;
  propertyType?: any;
  address?: {
    city?: any;
  };
}

async function fixSlugs() {
  console.log("🔧 Conectando a la base de datos...");
  await connectDB();

  console.log("🔍 Buscando propiedades con slugs mal formados...\n");

  // Encontrar todas las propiedades activas
  const properties = await PropertyModel.find({ status: "active" })
    .populate("propertyType", "slug")
    .populate("address.city", "slug")
    .lean() as PropertyDoc[];

  console.log(`📊 Total de propiedades encontradas: ${properties.length}`);

  let fixedCount = 0;
  let alreadyCorrectCount = 0;
  let errorCount = 0;

  for (const property of properties) {
    const slugParts = property.slug.split("-");
    const hasCorrectFormat = slugParts.length >= EXPECTED_PARTS;

    if (hasCorrectFormat) {
      alreadyCorrectCount++;
      continue;
    }

    console.log(`\n⚠️  Propiedad mal formada:`);
    console.log(`   Título: ${property.title}`);
    console.log(`   Slug actual: ${property.slug}`);

    // Obtener tipo de propiedad y ciudad
    const typeSlug = (property as any).propertyType?.slug;
    const citySlug = (property as any).address?.city?.slug;

    if (!typeSlug || !citySlug) {
      console.log(`   ❌ ERROR: Falta tipo (${typeSlug}) o ciudad (${citySlug})`);
      errorCount++;
      continue;
    }

    // Generar nuevo slug
    const middle = slugify(property.title, { lower: true, strict: true });
    const newSlug = `${typeSlug}-${middle}-${citySlug}`;

    console.log(`   → Nuevo slug: ${newSlug}`);

    // Verificar si el nuevo slug ya existe (para evitar duplicados)
    const existingWithNewSlug = await PropertyModel.findOne({ slug: newSlug });
    if (existingWithNewSlug && existingWithNewSlug._id.toString() !== property._id.toString()) {
      console.log(`   ⚠️  El slug ya existe, generando con counter...`);
      let counter = 1;
      let finalSlug = newSlug;
      while (await PropertyModel.findOne({ slug: finalSlug })) {
        finalSlug = `${newSlug}-${counter}`;
        counter++;
      }
      console.log(`   → Slug final: ${finalSlug}`);
      
      await PropertyModel.updateOne(
        { _id: property._id },
        { $set: { slug: finalSlug } }
      );
    } else {
      await PropertyModel.updateOne(
        { _id: property._id },
        { $set: { slug: newSlug } }
      );
    }

    fixedCount++;
  }

  console.log("\n" + "=".repeat(50));
  console.log("📈 RESUMEN:");
  console.log(`   ✅ Ya correctas: ${alreadyCorrectCount}`);
  console.log(`   🔧 Corregidas: ${fixedCount}`);
  console.log(`   ❌ Errores (faltan datos): ${errorCount}`);
  console.log("=".repeat(50));

  if (fixedCount > 0) {
    console.log("\n🚀 Slugs corregidos. Ejecuta `npm run build` para actualizar la caché.");
  }

  process.exit(errorCount > 0 ? 1 : 0);
}

fixSlugs().catch(console.error);
