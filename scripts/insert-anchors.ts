// scripts/insert-anchors.ts
// Inserta anchors contextuales y CTAs comerciales en los 6 posts clave.
// Los anchors apuntan SOLO a:
//   - /departamentos-en-venta-general-roca
//   - /terrenos-en-venta-general-roca
//
// Convención:
//   - type "replace": reemplaza `find` con `replace` (solo la primera ocurrencia)
//   - type "section_end": reemplaza desde `startMarker` hasta el final del contenido
//     (usado para reemplazar secciones de "Conclusión")
//   - type "append": agrega `insert` al final del contenido
//
// Uso:
//   npx tsx scripts/insert-anchors.ts            # dry-run (default)
//   npx tsx scripts/insert-anchors.ts --apply    # aplica y guarda en DB

import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI || "";
const APPLY = process.argv.includes("--apply");

// ───────────────────────────────────────────────────────────────────
// CTAs reutilizables (mismas URLs y WhatsApp en todos los posts)
// ───────────────────────────────────────────────────────────────────

const CTA_DEPTOS_TERRENOS = `<div class="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
  <h3 class="text-xl font-bold text-neutral-900 mb-3">Comprá o invertí hoy en General Roca</h3>
  <p class="text-neutral-700 mb-4">Departamentos y terrenos listos para escriturar. Te acompañamos del primer llamado hasta la firma.</p>
  <div class="flex flex-wrap gap-3">
    <a href="/departamentos-en-venta-general-roca" class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-white font-semibold hover:bg-primary/90 transition">Ver departamentos en venta</a>
    <a href="/terrenos-en-venta-general-roca" class="inline-flex items-center gap-2 rounded-xl border border-primary px-5 py-2.5 text-primary font-semibold hover:bg-primary/10 transition">Ver terrenos en venta</a>
    <a href="https://wa.me/5492984582082?text=Hola!%20Quiero%20asesoramiento%20sobre%20propiedades%20en%20General%20Roca." target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-white font-semibold hover:bg-green-600 transition">WhatsApp directo</a>
  </div>
</div>`;

const CTA_SOLO_DEPTOS = `<div class="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
  <h3 class="text-xl font-bold text-neutral-900 mb-3">Encontrá tu departamento en General Roca</h3>
  <p class="text-neutral-700 mb-4">Monoambientes, 1 y 2 ambientes con la mejor renta del Alto Valle. Filtrá por zona, precio y apto crédito.</p>
  <div class="flex flex-wrap gap-3">
    <a href="/departamentos-en-venta-general-roca" class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-white font-semibold hover:bg-primary/90 transition">Ver departamentos en venta</a>
    <a href="https://wa.me/5492984582082?text=Hola!%20Quiero%20asesoramiento%20sobre%20departamentos%20en%20General%20Roca." target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-white font-semibold hover:bg-green-600 transition">Asesorate por WhatsApp</a>
  </div>
</div>`;

const CTA_SOLO_TERRENOS = `<div class="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
  <h3 class="text-xl font-bold text-neutral-900 mb-3">Terrenos con zonificación validada en General Roca</h3>
  <p class="text-neutral-700 mb-4">Te entregamos el informe de zonificación del lote antes de avanzar. Sin sorpresas, sin permisos denegados.</p>
  <div class="flex flex-wrap gap-3">
    <a href="/terrenos-en-venta-general-roca" class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-white font-semibold hover:bg-primary/90 transition">Ver terrenos en venta</a>
    <a href="https://wa.me/5492984582082?text=Hola!%20Quiero%20asesoramiento%20sobre%20terrenos%20en%20General%20Roca." target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-white font-semibold hover:bg-green-600 transition">WhatsApp directo</a>
  </div>
</div>`;

const CTA_DEPTOS_TERRENOS_MERCADO = `<div class="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
  <h3 class="text-xl font-bold text-neutral-900 mb-3">Comprá o invertí hoy en General Roca</h3>
  <p class="text-neutral-700 mb-4">Con los precios del mercado actualizados, encontrá la propiedad que buscás en cualquiera de las dos verticales más activas del Alto Valle.</p>
  <div class="flex flex-wrap gap-3">
    <a href="/departamentos-en-venta-general-roca" class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-white font-semibold hover:bg-primary/90 transition">Departamentos en venta</a>
    <a href="/terrenos-en-venta-general-roca" class="inline-flex items-center gap-2 rounded-xl border border-primary px-5 py-2.5 text-primary font-semibold hover:bg-primary/10 transition">Terrenos en venta</a>
    <a href="https://wa.me/5492984582082?text=Hola!%20Quiero%20asesoramiento%20sobre%20el%20mercado%20inmobiliario%20en%20General%20Roca." target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-white font-semibold hover:bg-green-600 transition">WhatsApp directo</a>
  </div>
</div>`;

// ───────────────────────────────────────────────────────────────────
// Configuración por post
// ───────────────────────────────────────────────────────────────────

interface ReplaceOp {
  type: "replace";
  description: string;
  find: string;
  replace: string;
}

interface SectionEndOp {
  type: "section_end";
  description: string;
  startMarker: string;
  insert: string;
}

interface AppendOp {
  type: "append";
  description: string;
  insert: string;
}

type Op = ReplaceOp | SectionEndOp | AppendOp;

interface PostConfig {
  slug: string;
  label: string;
  ops: Op[];
}

const CONFIG: PostConfig[] = [
  // ── POST 1 — Comprar/Vender ──────────────────────────────────────
  {
    slug: "comprar-o-vender-una-propiedad-en-general-roca-guia-completa-de-tramites-impuestos-y-costos-en-2026",
    label: "Comprar/Vender GR — Guía 2026",
    ops: [
      {
        type: "replace",
        description: "Anchor 1: deptos + terrenos en intro (después del párrafo 'información actualizada al año 2025')",
        find: `información actualizada al año 2025.</p><hr>`,
        replace: `información actualizada al año 2025.</p><p>Si tu objetivo es comprar, hoy la oferta vigente en <a href="/departamentos-en-venta-general-roca">departamentos en venta en General Roca</a> y en <a href="/terrenos-en-venta-general-roca">terrenos en venta en General Roca</a> es una de las más activas del Alto Valle, lo que te permite comparar y negociar antes de firmar.</p><hr>`,
      },
      {
        type: "replace",
        description: "CTA final: reemplaza sección '¿Querés vender o comprar en General Roca?'",
        find: `<h2>¿Querés vender o comprar en General Roca?</h2><p>Si tenés dudas o querés avanzar con una operación segura, asesorate con profesionales matriculados con experiencia en el mercado local.</p><p>En Riquelme Propiedades te acompañamos en todo el proceso, desde la tasación hasta la firma de la escritura.</p>`,
        replace: CTA_DEPTOS_TERRENOS,
      },
    ],
  },

  // ── POST 2 — Invertir Departamentos ──────────────────────────────
  {
    slug: "invertir-departamentos-pequenos-alto-valle-renta-2026",
    label: "Invertir en Departamentos — Alto Valle 2026",
    ops: [
      {
        type: "replace",
        description: "Anchor 1: deptos después del párrafo de monoambientes (USD 45.000-65.000)",
        find: `USD 55.000 a USD 70.000.</p> <h2>Perfil del inquilino típico</h2>`,
        replace: `USD 55.000 a USD 70.000.</p><p>Para validar estos números con la oferta vigente, consultá nuestra cartera actualizada de <a href="/departamentos-en-venta-general-roca">departamentos en venta en General Roca</a> y compará valor de mercado vs. renta esperada.</p> <h2>Perfil del inquilino típico</h2>`,
      },
      {
        type: "replace",
        description: "Anchor 2: deptos zona centro en bullet 'Trabajadores golondrina'",
        find: `<strong>Trabajadores golondrina:</strong> Empleados de empresas agroindustriales y de servicios que alquilan por períodos de 3 a 6 meses.</li>`,
        replace: `<strong>Trabajadores golondrina:</strong> Empleados de empresas agroindustriales y de servicios que alquilan por períodos de 3 a 6 meses. Si querés apuntar a este perfil, priorizá unidades céntricas de 1 ambiente: tenés opciones en <a href="/departamentos-en-venta-general-roca">departamentos en venta en la zona centro de General Roca</a> con la demanda más alta de la ciudad.</li>`,
      },
      {
        type: "replace",
        description: "CTA final: append al final del último párrafo",
        find: `se rentan más rápido y mantienen mejor su valor en el tiempo.</p>`,
        replace: `se rentan más rápido y mantienen mejor su valor en el tiempo.</p>${CTA_SOLO_DEPTOS}`,
      },
    ],
  },

  // ── POST 3 — Zonificación ────────────────────────────────────────
  {
    slug: "zonificacion-y-codigo-urbano-en-el-alto-valle-que-tenes-que-saber-antes-de-comprar-o-construir",
    label: "Zonificación y Código Urbano — Alto Valle",
    ops: [
      {
        type: "replace",
        description: "Anchor 1: terrenos en bullet 'Verificar la zonificación exacta del lote'",
        find: `<li><p>Verificar la zonificación exacta del lote</p></li>`,
        replace: `<li><p>Verificar la zonificación exacta del lote — antes de avanzar, revisá nuestra oferta de <a href="/terrenos-en-venta-general-roca">terrenos en venta en General Roca</a> con la zonificación ya validada</p></li>`,
      },
      {
        type: "replace",
        description: "Anchor 2: terrenos en bullet 'Las condiciones varían mucho según barrio'",
        find: `<li><p>Las condiciones varían mucho según barrio y tipo de calle</p></li>`,
        replace: `<li><p>Las condiciones varían mucho según barrio y tipo de calle. Por eso, antes de comprar, <a href="/terrenos-en-venta-general-roca">explorá los terrenos disponibles en General Roca</a> y pedinos el informe de zonificación del lote que te interesa</p></li>`,
      },
      {
        type: "section_end",
        description: "CTA final: reemplaza sección '## Conclusión' hasta el final",
        startMarker: `<hr><h2>Conclusión</h2>`,
        insert: CTA_SOLO_TERRENOS,
      },
    ],
  },

  // ── POST 4 — Escritura ───────────────────────────────────────────
  {
    slug: "escritura-inmueble-rio-negro-tramites-costos-2026",
    label: "Escritura de Inmueble — Río Negro",
    ops: [
      {
        type: "replace",
        description: "Anchor 1: deptos en bullet 'Verificar la titularidad del inmueble'",
        find: `<li>Verificar la titularidad del inmueble y su situación legal.</li>`,
        replace: `<li>Verificar la titularidad del inmueble y su situación legal. Si todavía estás evaluando opciones, <a href="/departamentos-en-venta-general-roca">departamentos en venta en General Roca</a> incluyen unidades ya listas para escriturar con toda la documentación al día.</li>`,
      },
      {
        type: "replace",
        description: "CTA final: append al último párrafo (Plazos)",
        find: `disponibilidad de turnos en el Registro de la Propiedad.</p>`,
        replace: `disponibilidad de turnos en el Registro de la Propiedad.</p>${CTA_SOLO_DEPTOS}`,
      },
    ],
  },

  // ── POST 5 — Crédito Hipotecario ────────────────────────────────
  {
    slug: "credito-hipotecario-en-argentina-2026-como-comprar-una-propiedad-apta-credito-paso-a-paso",
    label: "Crédito Hipotecario UVA 2026",
    ops: [
      {
        type: "replace",
        description: "Anchor 1: deptos en bullet 'Valores por m² más accesibles'",
        find: `<li><p>Valores por m² más accesibles que en grandes centros urbanos</p></li>`,
        replace: `<li><p>Valores por m² más accesibles que en grandes centros urbanos. Desde USD 70.000 encontrás <a href="/departamentos-en-venta-general-roca">departamentos en venta en General Roca</a> ya validados como aptos crédito</p></li>`,
      },
      {
        type: "replace",
        description: "Anchor 2: deptos después del ejemplo 'Ahorro necesario USD 30.000'",
        find: `Ahorro necesario: USD 30.000</p></li></ul><p>Este punto es clave: sin ahorro previo, no hay acceso al crédito.</p>`,
        replace: `Ahorro necesario: USD 30.000</p></li></ul><p>Este punto es clave: sin ahorro previo, no hay acceso al crédito.</p><p>Conocé propiedades en ese rango y consultá por el apto crédito acá: <a href="/departamentos-en-venta-general-roca">departamentos en venta en General Roca</a> desde USD 70.000 financiables.</p>`,
      },
      {
        type: "section_end",
        description: "CTA final: reemplaza sección '## Conclusión: ¿es buen momento...' hasta el final",
        startMarker: `<hr><h3>Conclusión: ¿es buen momento para comprar con crédito?</h3>`,
        insert: CTA_SOLO_DEPTOS,
      },
    ],
  },

  // ── POST 6 — Mercado Inmobiliario ────────────────────────────────
  {
    slug: "mercado-inmobiliario-en-general-roca-precios-zonas-y-oportunidades-en-2026",
    label: "Mercado Inmobiliario General Roca 2026",
    ops: [
      {
        type: "replace",
        description: "Anchor 1: deptos después del rango USD 1.400-1.500/m² (sección Departamentos)",
        find: `en casos puntuales</p></li></ul><h3>Casas</h3>`,
        replace: `en casos puntuales</p></li></ul><p>Estos valores se reflejan en la oferta vigente de <a href="/departamentos-en-venta-general-roca">departamentos en venta en General Roca</a> actualizada esta semana.</p><h3>Casas</h3>`,
      },
      {
        type: "replace",
        description: "Anchor 2: terrenos después de 'Lotes / Con servicios: USD 12.000 a 35.000'",
        find: `USD 12.000 a USD 35.000</strong></p></li></ul><p> En sectores en expansión o loteos nuevos.</p>`,
        replace: `USD 12.000 a USD 35.000</strong></p></li></ul><p> En sectores en expansión o loteos nuevos — <a href="/terrenos-en-venta-general-roca">terrenos en venta en General Roca</a> con servicios y zonificación validada.</p>`,
      },
      {
        type: "section_end",
        description: "CTA final: reemplaza sección '## Conclusión' hasta el final",
        startMarker: `<hr><h2>Conclusión</h2>`,
        insert: CTA_DEPTOS_TERRENOS_MERCADO,
      },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────
// Lógica del script
// ───────────────────────────────────────────────────────────────────

function applyOp(content: string, op: Op): { content: string; matched: boolean } {
  if (op.type === "replace") {
    if (!content.includes(op.find)) return { content, matched: false };
    const occurrences = content.split(op.find).length - 1;
    if (occurrences > 1) {
      console.log(`      ⚠️  Marker aparece ${occurrences} veces. Aplicando solo la primera.`);
    }
    return { content: content.replace(op.find, op.replace), matched: true };
  }
  if (op.type === "section_end") {
    const idx = content.indexOf(op.startMarker);
    if (idx === -1) return { content, matched: false };
    return { content: content.slice(0, idx) + op.insert, matched: true };
  }
  if (op.type === "append") {
    return { content: content + op.insert, matched: true };
  }
  return { content, matched: false };
}

async function main() {
  if (!MONGO_URI) {
    console.error("❌ Falta MONGODB_URI en .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ Conectado a MongoDB");
  console.log(`Modo: ${APPLY ? "🔴 APPLY (modifica DB)" : "🟡 DRY-RUN (solo muestra)"}\n`);

  const BlogPostSchema = new mongoose.Schema(
    { slug: String, title: String, content: String },
    { collection: "blogposts" }
  );
  const BlogPost = mongoose.model("BlogPost_AnchorInsert", BlogPostSchema);

  let totalOps = 0;
  let totalApplied = 0;
  let totalPosts = 0;
  let totalPostsChanged = 0;

  for (const cfg of CONFIG) {
    const post = await BlogPost.findOne({ slug: cfg.slug }).lean();
    if (!post) {
      console.log(`❌ NO ENCONTRADO: ${cfg.label} (${cfg.slug})`);
      continue;
    }
    totalPosts++;

    let content = (post.content as string) || "";
    let contentChanged = false;

    console.log(`\n— ${cfg.label}`);

    for (const op of cfg.ops) {
      totalOps++;
      const before = content.length;
      const result = applyOp(content, op);
      content = result.content;
      const after = content.length;

      if (result.matched) {
        contentChanged = true;
        totalApplied++;
        console.log(`   ✅ ${op.description}`);
        console.log(`      diff: ${after - before >= 0 ? "+" : ""}${after - before} chars`);
      } else {
        console.log(`   ❌ ${op.description}`);
        console.log(`      Marker no encontrado: "${op.find.slice(0, 100)}..."`);
      }
    }

    if (APPLY && contentChanged) {
      await BlogPost.updateOne({ _id: post._id }, { $set: { content } });
      console.log(`   💾 Guardado en DB (${content.length} chars)`);
      totalPostsChanged++;
    } else if (!contentChanged) {
      console.log(`   ⚠️  Sin cambios — no se guarda`);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Posts procesados:    ${totalPosts}/${CONFIG.length}`);
  console.log(`Ops aplicadas:       ${totalApplied}/${totalOps}`);
  console.log(`Posts modificados:   ${totalPostsChanged}`);

  if (!APPLY) {
    console.log(`\n💡 Para aplicar los cambios:`);
    console.log(`   npx tsx scripts/insert-anchors.ts --apply`);
  } else {
    console.log(`\n✅ DB actualizada.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("❌ Error:", err);
  await mongoose.disconnect();
  process.exit(1);
});
