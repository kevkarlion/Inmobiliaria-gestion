// scripts/apply-seo-metadata.ts
// Carga los 21 pares de seoTitle/seoDescription desde
// scripts/seo-metadata-update.json a la colección `blogposts`.
//
// Convención aplicada (ver scripts/fix-seo-title-suffix.ts):
//   seoTitle (DB) SIN el sufijo "| Riquelme Propiedades"
//   El sufijo lo agrega el layout vía title.template.
//
// Uso:
//   npx tsx scripts/apply-seo-metadata.ts            # dry-run (default)
//   npx tsx scripts/apply-seo-metadata.ts --apply    # aplica los cambios

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as fs from "node:fs";
import * as path from "node:path";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI || "";
const APPLY = process.argv.includes("--apply");
const JSON_PATH = path.join(__dirname, "seo-metadata-update.json");

interface SeoPair {
  slug: string;
  seoTitle: string;
  seoDescription: string;
}

async function main() {
  if (!MONGO_URI) {
    console.error("❌ Falta MONGODB_URI en .env.local");
    process.exit(1);
  }
  if (!fs.existsSync(JSON_PATH)) {
    console.error(`❌ No se encontró ${JSON_PATH}`);
    process.exit(1);
  }

  const pairs: SeoPair[] = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));

  await mongoose.connect(MONGO_URI);
  console.log("✅ Conectado a MongoDB");
  console.log(`Modo: ${APPLY ? "🔴 APPLY (modifica DB)" : "🟡 DRY-RUN (solo muestra)"}\n`);

  const BlogPostSchema = new mongoose.Schema(
    {
      title: String,
      slug: String,
      seoTitle: String,
      seoDescription: String,
    },
    { collection: "blogposts" }
  );
  const BlogPost = mongoose.model("BlogPost_SeoApply", BlogPostSchema);

  let ok = 0;
  let missing: string[] = [];

  for (const pair of pairs) {
    const post = await BlogPost.findOne({ slug: pair.slug }).lean();

    if (!post) {
      console.log(`❌ SLUG NO ENCONTRADO: ${pair.slug}`);
      missing.push(pair.slug);
      continue;
    }

    const titleLen = pair.seoTitle.length;
    const descLen = pair.seoDescription.length;
    const finalTitleLen = titleLen + 22; // + " | Riquelme Propiedades"

    const titleWarn = titleLen > 42 ? "⚠️  " : "   ";
    const finalTitleWarn = finalTitleLen > 65 ? "(title final > 65)" : "";

    console.log(`${titleWarn}— ${pair.slug}`);
    console.log(`     seoTitle       (${titleLen} chars, final ${finalTitleLen} chars) ${finalTitleWarn}`);
    console.log(`     seoDescription (${descLen} chars)`);

    if (descLen < 130 || descLen > 155) {
      console.log(`     ⚠️  Description fuera del rango 130-155 chars`);
    }

    if (APPLY) {
      await BlogPost.updateOne(
        { _id: post._id },
        {
          $set: {
            seoTitle: pair.seoTitle,
            seoDescription: pair.seoDescription,
          },
        }
      );
      console.log(`     ✅ Actualizado`);
    } else {
      console.log(`     ⏭️  (no aplicado — usar --apply)`);
    }
    ok++;
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Pares en JSON: ${pairs.length}`);
  console.log(`Encontrados en DB: ${ok}`);
  if (missing.length > 0) {
    console.log(`❌ Slugs faltantes: ${missing.length}`);
    missing.forEach((s) => console.log(`   - ${s}`));
  }

  if (!APPLY) {
    console.log(`\n💡 Para aplicar los cambios:`);
    console.log(`   npx tsx scripts/apply-seo-metadata.ts --apply`);
  } else {
    console.log(`\n✅ DB actualizada. Próximo paso: insertar anchors en los 6 posts clave.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("❌ Error:", err);
  await mongoose.disconnect();
  process.exit(1);
});
