// scripts/inspect-blog-content.ts
// Inspección del contenido completo de los 6 posts clave.
// Imprime todo el content de cada post para identificar marcadores estables.
//
// Uso:
//   npx tsx scripts/inspect-blog-content.ts > /tmp/inspect-output.txt 2>&1

import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SLUGS = [
  "comprar-o-vender-una-propiedad-en-general-roca-guia-completa-de-tramites-impuestos-y-costos-en-2026",
  "invertir-departamentos-pequenos-alto-valle-renta-2026",
  "zonificacion-y-codigo-urbano-en-el-alto-valle-que-tenes-que-saber-antes-de-comprar-o-construir",
  "escritura-inmueble-rio-negro-tramites-costos-2026",
  "credito-hipotecario-en-argentina-2026-como-comprar-una-propiedad-apta-credito-paso-a-paso",
  "mercado-inmobiliario-en-general-roca-precios-zonas-y-oportunidades-en-2026",
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);

  const BlogPostSchema = new mongoose.Schema(
    { slug: String, title: String, content: String },
    { collection: "blogposts" }
  );
  const BlogPost = mongoose.model("BlogPost_Inspect", BlogPostSchema);

  for (const slug of SLUGS) {
    const post = await BlogPost.findOne({ slug }).lean();
    if (!post) {
      console.log(`❌ NO ENCONTRADO: ${slug}\n`);
      continue;
    }

    console.log(`\n${"=".repeat(80)}`);
    console.log(`SLUG: ${slug}`);
    console.log(`TITLE: ${post.title}`);
    console.log(`CONTENT LENGTH: ${(post.content || "").length} chars`);
    console.log(`${"=".repeat(80)}\n`);
    console.log(post.content || "");
    console.log("\n");
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
