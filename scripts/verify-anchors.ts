// scripts/verify-anchors.ts
// Verifica que los 6 posts clave tienen los anchors y CTA insertados correctamente.
//
// Uso:
//   npx tsx scripts/verify-anchors.ts

import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const TARGET_SLUGS = [
  "comprar-o-vender-una-propiedad-en-general-roca-guia-completa-de-tramites-impuestos-y-costos-en-2026",
  "invertir-departamentos-pequenos-alto-valle-renta-2026",
  "zonificacion-y-codigo-urbano-en-el-alto-valle-que-tenes-que-saber-antes-de-comprar-o-construir",
  "escritura-inmueble-rio-negro-tramites-costos-2026",
  "credito-hipotecario-en-argentina-2026-como-comprar-una-propiedad-apta-credito-paso-a-paso",
  "mercado-inmobiliario-en-general-roca-precios-zonas-y-oportunidades-en-2026",
];

const URL_DEPTOS = "/departamentos-en-venta-general-roca";
const URL_TERRENOS = "/terrenos-en-venta-general-roca";

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!, { dbName: "inmobiliaria" });

  const BlogPostSchema = new mongoose.Schema(
    { slug: String, title: String, content: String },
    { collection: "blogposts" }
  );
  const BlogPost = mongoose.model("BlogPost_Verify", BlogPostSchema);

  console.log("\n========================================");
  console.log("VERIFICACIÓN DE ANCHORS Y CTAs");
  console.log("========================================\n");

  let allOk = true;

  for (const slug of TARGET_SLUGS) {
    const post = await BlogPost.findOne({ slug }).lean();
    if (!post) {
      console.log(`❌ ${slug}\n   NO ENCONTRADO\n`);
      allOk = false;
      continue;
    }

    const content = post.content || "";
    const hasDeptosAnchor = content.includes(`href="${URL_DEPTOS}"`);
    const hasTerrenosAnchor = content.includes(`href="${URL_TERRENOS}"`);
    const hasCtaBlock = content.includes("mt-10 rounded-2xl");

    const ok = (hasDeptosAnchor || hasTerrenosAnchor) && hasCtaBlock;
    if (!ok) allOk = false;

    const status = ok ? "✅" : "⚠️ ";
    console.log(`${status} ${post.title}`);
    console.log(`   deptos anchor:    ${hasDeptosAnchor ? "✅" : "—"}`);
    console.log(`   terrenos anchor:  ${hasTerrenosAnchor ? "✅" : "—"}`);
    console.log(`   CTA final:        ${hasCtaBlock ? "✅" : "❌"}`);
    console.log();
  }

  console.log("========================================");
  console.log(allOk ? "✅ Todos los posts verificados" : "⚠️  Hay posts incompletos");
  console.log("========================================\n");

  await mongoose.disconnect();
  process.exit(allOk ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
