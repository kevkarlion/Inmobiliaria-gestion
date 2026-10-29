// scripts/fix-seo-title-suffix.ts
// Limpia el sufijo hardcodeado "| Riquelme Propiedades" del campo `seoTitle`
// de los BlogPost.
//
// Contexto:
//   El layout público (`src/app/(public)/layout.tsx`) define:
//     title: { default: "...", template: "%s | Riquelme Propiedades" }
//   Next.js concatena automáticamente ese sufijo al title final.
//   Si el `seoTitle` guardado en DB ya contiene el sufijo, el render queda:
//
//     "Guía para Comprar tu Primera Casa... 2026 | Riquelme Propiedades | Riquelme Propiedades"
//
//   Convención a partir de ahora:
//     seoTitle (DB) = título del contenido SIN el sufijo
//     Title (HTML)  = seoTitle + " | Riquelme Propiedades" (agregado por el template)
//
// Uso:
//   npx tsx scripts/fix-seo-title-suffix.ts            # dry-run (default, no modifica)
//   npx tsx scripts/fix-seo-title-suffix.ts --apply    # aplica los cambios en la DB

import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI || "";
const APPLY = process.argv.includes("--apply");

// Matchea el sufijo al final con cualquier variación de espacios.
//   "Foo | Riquelme Propiedades"           ✓
//   "Foo|Riquelme Propiedades"             ✓
//   "Foo  |   Riquelme Propiedades   "     ✓
//   "Foo | Riquelme propiedades" (case)    ✓ (case-insensitive)
const SUFFIX_PATTERN = /\s*\|\s*Riquelme\s+Propiedades\s*$/i;

async function main() {
  if (!MONGO_URI) {
    console.error("❌ Falta MONGODB_URI en .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ Conectado a MongoDB");
  console.log(`Modo: ${APPLY ? "🔴 APPLY (modifica DB)" : "🟡 DRY-RUN (solo muestra)"}\n`);

  // Schema mínimo, leemos solo lo que necesitamos
  const BlogPostSchema = new mongoose.Schema(
    {
      title: String,
      slug: String,
      seoTitle: String,
    },
    { collection: "blogposts" }
  );
  const BlogPost = mongoose.model("BlogPost_SeoFix", BlogPostSchema);

  const posts = await BlogPost.find({
    seoTitle: { $exists: true, $nin: [null, ""] },
  }).lean();

  const affected = posts.filter((p) => p.seoTitle && SUFFIX_PATTERN.test(p.seoTitle));

  console.log(`📊 Posts totales con seoTitle: ${posts.length}`);
  console.log(`⚠️  Posts con sufijo hardcodeado: ${affected.length}\n`);

  if (affected.length === 0) {
    console.log("✅ Nada que limpiar. Convención OK en todos los posts.");
    process.exit(0);
  }

  let fixedCount = 0;
  for (const post of affected) {
    const oldTitle = post.seoTitle as string;
    const newTitle = oldTitle.replace(SUFFIX_PATTERN, "").trim();

    console.log(`— ${post.slug}`);
    console.log(`  OLD: "${oldTitle}"  (${oldTitle.length} chars)`);
    console.log(`  NEW: "${newTitle}"  (${newTitle.length} chars)`);

    if (APPLY) {
      await BlogPost.updateOne(
        { _id: post._id },
        { $set: { seoTitle: newTitle } }
      );
      console.log(`  ✅ Actualizado`);
    } else {
      console.log(`  ⏭️  (no aplicado — usar --apply)`);
    }
    fixedCount++;
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Total procesados: ${fixedCount}`);

  if (!APPLY) {
    console.log(`\n💡 Para aplicar los cambios en la DB:`);
    console.log(`   npx tsx scripts/fix-seo-title-suffix.ts --apply`);
  } else {
    console.log(`✅ DB actualizada.`);
    console.log(`\n💡 Próximo paso: cargar los nuevos seoTitle/seoDescription de los 21 posts.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("❌ Error:", err);
  await mongoose.disconnect();
  process.exit(1);
});
