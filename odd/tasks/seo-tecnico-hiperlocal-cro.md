# SEO Técnico, On-Page, CRO y Arquitectura Hiperlocal — riquelmeprop.com

Refactorización integral de Home Page, catálogo `/venta-de-propiedades`, blog `/novedades/`,
Footer global y Schema JSON-LD para multiplicar impresiones, elevar el CTR, mejorar la
conversión móvil (CRO) y capturar el tráfico hiperlocal de General Roca y el Alto Valle.

## Specs

### S1 — H1 único de la Home

La Home debe tener un único tag `<h1>` en el Hero section:

```html
<h1>Inmobiliaria en General Roca | Venta de Casas, Departamentos y Terrenos</h1>
```

### S2 — Jerarquía H2 de secciones secundarias

Ajusta las secciones secundarias para usar estrictamente tags `<h2>`:

- `<h2>Oportunidades de Inversión Inmobiliaria</h2>`
- `<h2>Propiedades Destacadas en Venta</h2>`
- `<h2>Novedades y Guías Inmobiliarias del Alto Valle</h2>`
- `<h2>Estrategia Aplicada a Activos Inmobiliarios</h2>`

### S3 — Exclusión de propiedades no disponibles en la Home

Filtra las consultas de backend / base de datos que alimentan los carruseles de la Home para
evitar mostrar propiedades con estado `VENDIDO`, `VENDIDA` o `RESERVADO`:

```typescript
const homeProperties = await getProperties({
  estado: { $nin: ['VENDIDO', 'VENDIDA', 'RESERVADO'] },
  limit: 6,
  sort: { createdAt: -1 }
});
```

### S4 — Módulo de Novedades y Guías (`<HomeBlogSection />`)

Crea un componente que obtenga las últimas 3 publicaciones del blog (`/novedades/`) y las
muestre en la parte inferior de la Home. Enlaza hacia las guías principales: *Zonificación y
Código Urbano*, *Trámites e Impuestos 2026* y *Escrituración*.

### S5 — Schema JSON-LD (`RealEstateAgent`) en la Home

Inyecta en el `<head>` de la Home el esquema de entidad comercial local:

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Riquelme Propiedades",
  "image": "https://www.riquelmeprop.com/logo.png",
  "@id": "https://www.riquelmeprop.com/#organization",
  "url": "https://www.riquelmeprop.com",
  "telephone": "+5492984582082",
  "email": "info@riquelmeprop.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "General Roca",
    "addressRegion": "Río Negro",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-39.0298",
    "longitude": "-67.5792"
  },
  "areaServed": ["General Roca", "Alto Valle", "Las Grutas", "San Carlos de Bariloche", "Sierra Grande"],
  "sameAs": ["https://www.instagram.com/", "https://www.facebook.com/"]
}
```

### S6 — H1 del catálogo de ventas

Cambia el H1 principal del catálogo a: `"Propiedades en Venta en General Roca y Alto Valle"`.

### S7 — Títulos de tarjetas estandarizados (cola larga)

Estandariza la generación de títulos de cada tarjeta de propiedad para seguir el patrón SEO de
cola larga: `[Tipo de Inmueble] en Venta en [Barrio / Zona], [Localidad]`
*(Ejemplo: "Casa en Venta en Barrio 210 Viviendas, General Roca" o "Terreno en Venta en Don
Fernando, General Roca")*.

### S8 — Orden de la grilla: activas primero

Ordena la grilla de propiedades para que las unidades activas aparezcan primero y las marcadas
como `VENDIDO` o `RESERVADO` se desplacen automáticamente al final.

### S9 — CTA de captura de leads en propiedades vendidas

En la vista individual de propiedades vendidas, reemplaza los botones de consulta habituales por
un formulario/CTA específico:

> "Esta propiedad ya fue vendida. ¿Buscás una opción similar en [Barrio]? Déjanos tu contacto
> para avisarte en cuanto ingrese un nuevo inmueble."

### S10 — UX móvil: filtros rápidos (chips/pills) en el catálogo

Añade una barra horizontal deslizable en la parte superior del catálogo con accesos rápidos:
`[General Roca]`, `[Casas]`, `[Terrenos]`, `[Departamentos en Pozo]`, `[Las Grutas]`.

### S11 — Botón de WhatsApp directo por tarjeta

Agrega en cada tarjeta un botón directo de WhatsApp que abra la aplicación con un texto
precompletado dinámico: `"Hola! Quiero consultar por la propiedad [Título de la Propiedad] (Ref:
Venta)"`, seguido del enlace canónico de la propiedad para que el asesor reciba el link de la
unidad consultada:

```
Hola! Quiero consultar por la propiedad [Título de la Propiedad] (Ref: Venta)
[Título de la Propiedad]: https://www.riquelmeprop.com/propiedad/[slug]
```

### S12 — Schema JSON-LD (`ItemList`) del catálogo

Estructura el catálogo con el esquema `ItemList` para habilitar resultados enriquecidos en Google:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "RealEstateListing",
        "name": "Casa en Venta en Barrio La Martina",
        "url": "https://www.riquelmeprop.com/propiedad/casa-la-martina-general-roca"
      }
    }
  ]
}
```

### S14 — Artículos de la home seleccionados desde el admin

La sección "Novedades y Guías Inmobiliarias del Alto Valle" de la home muestra **solo artículos
enlazados por slug**, y el editor decide cuáles ver desde `/admin/novedades`:

- Cada post tiene un flag `featuredOnHome` (booleano) y un `homeOrder` (número).
- La home consulta los posts publicados con `featuredOnHome: true`, ordenados por `homeOrder`
  ascendente y, a igual orden, por publicación más reciente.
- Si todavía no hay artículos seleccionados, la home cae a los 3 más recientes para no quedar
  vacía.
- Desde `/admin/novedades`: switch "Mostrar este artículo en la home" + input "Orden en la
  home" en el alta/edición, y toggle rápido por fila en el listado.

### S15 — La home no enlaza a páginas de categoría

Las tarjetas de la sección de blog enlazan al artículo exacto (`/novedades/<slug>`); se eliminan
los enlaces a categorías (`/novedades/comunidad`, `/novedades/normativa`, `/novedades/guias`).

### S13 — `SeoFooterGrid` con enlazado hiperlocal

Agrega en la plantilla global del pie de página (Footer) una matriz de enlaces estratégicos para
transferir autoridad y posicionar términos locales:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-neutral-400 mt-8 border-t border-neutral-800 pt-6">
  <div>
    <h4 className="font-semibold text-white mb-2">Propiedades por Categoría</h4>
    <ul className="space-y-1">
      <li><Link href="/casas-en-venta-general-roca">Casas en Venta en General Roca</Link></li>
      <li><Link href="/terrenos-en-venta-general-roca">Terrenos y Loteos en General Roca</Link></li>
      <li><Link href="/departamentos-en-venta-general-roca">Departamentos en Venta en General Roca</Link></li>
    </ul>
  </div>
  <div>
    <h4 className="font-semibold text-white mb-2">Búsquedas por Barrio</h4>
    <ul className="space-y-1">
      <li><Link href="/venta-de-propiedades?barrio=210-viviendas">Barrio 210 Viviendas</Link></li>
      <li><Link href="/venta-de-propiedades?barrio=don-fernando">Barrio Don Fernando</Link></li>
      <li><Link href="/venta-de-propiedades?barrio=827-viviendas">Barrio 827 Viviendas</Link></li>
      <li><Link href="/venta-de-propiedades?barrio=stefenelli">Stefenelli Sur y Norte</Link></li>
    </ul>
  </div>
  <div>
    <h4 className="font-semibold text-white mb-2">Otras Zonas de Interés</h4>
    <ul className="space-y-1">
      <li><Link href="/venta-de-propiedades?ubicacion=las-grutas">Propiedades en Las Grutas</Link></li>
      <li><Link href="/venta-de-propiedades?ubicacion=bariloche">Propiedades en San Carlos de Bariloche</Link></li>
      <li><Link href="/venta-de-propiedades?ubicacion=sierra-grande">Lotes en Costa Dorada (Sierra Grande)</Link></li>
    </ul>
  </div>
</div>
```

## Tasks

| ID  | Task                                                                 | Specs  | Route | Commit |
|-----|----------------------------------------------------------------------|--------|-------|--------|
| T1  | Capa de datos: filtro de disponibilidad (no sold/reserved) + filtro de barrio por texto + helper de título SEO | S3, S7 | inline | `3b94df7` feat(seo): add availability and barrio filters plus seo title helper |
| T2  | Home: H1 del Hero, H2 de secciones, HomeBlogSection y JSON-LD RealEstateAgent | S1, S2, S4, S5 | inline | `afef841` feat(seo): rework home headings blog section and local business schema |
| T3  | Catálogo: H1, títulos estandarizados, orden activos primero, chips rápidos, WhatsApp por tarjeta, ItemList | S6, S7, S8, S10, S11, S12 | inline | `3352afb` feat(catalog): rework venta catalog seo titles ordering and mobile cto |
| T4  | Detalle de propiedad vendida: CTA de captura de leads | S9 | inline | `945c4a3` feat(cro): add sold property lead capture cta |
| T5  | Footer: `SeoFooterGrid` con enlazado hiperlocal | S13 | delegate (worker) | `551d1ae` feat(seo): add hyperlocal seo footer grid |
| T6  | Tests de regresión (RED primero) para S1-S13                        | S1-S13 | inline | `f37640f` test(seo): cover hyperlocal seo and cro changes |
| T7  | Reparación de deuda preexistente que bloqueaba el build (CollectionPage + tipos de scripts) + tests de breadcrumbs | S12 | inline | `caa35a7` fix(seo): restore CollectionPage schema and repair stale breadcrumb tests |
| T8  | Verificación: lint, suite completa, build y cierre                   | S1-S13 | inline | — |
| T9  | Curaduría de la home: flag + orden en el modelo, servicio, home y admin | S14, S15 | inline | `feat(blog): curate home articles from admin` |
| T10 | Verificación final de la curaduría (tests + round trip en base real) | S14, S15 | inline | — |

## Log

- L1 — L1 (2026-04-17): "PROMPT MAESTRO: Refactorización Integral SEO Técnico, On-Page, CRO y Arquitectura en Next.js (riquelmeprop.com)". Objetivo: "Refactorizar y optimizar todo el sitio web de `riquelmeprop.com` (Home Page, Catálogo `/venta-de-propiedades`, Blog `/novedades/`, Footer Global y Schema JSON-LD) para multiplicar impresiones, elevar el CTR, mejorar la conversión móvil (CRO) y capturar el tráfico hiperlocal de General Roca y el Alto Valle."
- L2 — Decisión de implementación (2026-04-17): el modelo de datos no tiene campo `estado`; la no disponibilidad se modela con `flags.sold` y `flags.reserved`. S3 se implementa filtrando ambos flags en la capa de consulta, conservando el resultado observable pedido (no mostrar VENDIDO/VENDIDA/RESERVADO en los carruseles de la Home).
- L3 — Decisión de implementación (2026-04-17): `address.barrio` es texto libre (string), no una referencia a la colección `Barrio`; el filtro por barrio (S13) se resuelve por coincidencia normalizada de texto sobre `address.barrio`.
- L4 — Decisión de implementación (2026-04-17): los enlaces del footer y los chips del catálogo usan `?barrio=` y `?ubicacion=` sobre `/venta-de-propiedades`; el catálogo pasa a leer `searchParams` y a filtrar en servidor.
- L5 — Desviación documentada (2026-04-17): el JSON-LD `RealEstateAgent` deriva todas las URLs absolutas de `SITE_URL` (el dominio canónico configurado por entorno) en lugar de fijarlas a mano, y `sameAs` apunta a los perfiles reales de Instagram/Facebook en lugar de URLs genéricas vacías. La imagen referencia un logo existente del sitio (`/logo-desktop-2026.png`): no existe `public/logo.png`.
- L6 — Desviación documentada (2026-04-17): el CTA de propiedades vendidas (S9) se aplica solo a las ya vendidas (`flags.sold`); las reservadas mantienen el botón de consulta, porque el texto pedido ("ya fue vendida") no aplica a una unidad reservada.
- L7 — Desviación documentada (2026-04-17): el `ItemList` del catálogo (S12) se implementa con un builder nuevo (`buildCatalogItemListSchema`) que anida `RealEstateListing`; el builder previo (`buildItemListSchema`) se conserva intacto para no alterar los listados que ya lo usan (`/propiedades/[filter]`, `/[seoCategory]`).
- L8 — Deuda preexistente reparada (2026-04-17): el build de producción fallaba antes de este trabajo por `buildCollectionPageSchema` inexistente (módulo ausente) y por errores de tipos en `scripts/`. Se implementó el builder faltante, se emitió `CollectionPage` en las páginas de listado y se repararon los scripts (`fix-seo-title-suffix.ts`, `insert-anchors.ts`, `apply-seo-metadata.ts`).
- L9 — Deuda preexistente reparada (2026-04-17): seis aserciones de `__tests__/seo/breadcrumbs.test.ts`, `propertyDetailPage.test.tsx` y `seoCategoryPage.test.tsx` seguían esperando que el último crumb viniera con `item` vacío; la implementación vigente (documentada en `src/lib/seo/breadcrumbs.ts`) apunta a la URL canónica de la página actual. Se alinearon las aserciones con ese comportamiento, sin cambiar el código de producción.
- L10 — Límite de slice (2026-04-17): el work unit T3 superó las ~400 líneas porque la reescritura de `PropertyCardGridSearch` reformatea el componente completo; el resto de los commits se mantienen por debajo del límite.
- L11 — Verificación (2026-04-17): `npm run lint` con 1 error preexistente fuera de alcance (`src/app/admin/AdminLayoutClient.tsx`, `setState` dentro de un efecto), `npx tsc --noEmit` sin errores, `npx vitest run` con 34 archivos / 228 tests en verde (la base tenía 6 archivos y 9 tests en rojo) y `npm run build` compilando correctamente.
- L12 — Bugfix CRO (2026-04-17): el enlace de WhatsApp del detalle usaba `54` + teléfono crudo y generaba números internacionales inválidos (`542984582082`). Se agregó `normalizeArgentinePhone` (54 + 9 + 10 dígitos) y se aplica tanto en las tarjetas del catálogo como en el botón "Contactar asesor".
- L13 — Entidades JSON-LD (2026-04-17): el layout global ya emitía un `RealEstateAgent`; para que Google no mezcle dos entidades del mismo tipo, el schema del layout recibió `@id` propio (`#localbusiness`) y el de la home quedó con `#organization`.
- L14 — Verificación funcional en producción (2026-04-17): `npm run build` + `npm run start` contra la base real. Home: un solo `h1` con el texto pedido y los cuatro `h2`; catálogo: `h1` nuevo, títulos estandarizados, orden activos primero, botón de WhatsApp por tarjeta con mensaje precompletado, `ItemList` con `RealEstateListing` y `CollectionPage`; filtros `?barrio=`, `?ubicacion=` y `?tipo=` resuelven contra datos reales (Andrade 1, Centro 1, General Roca 23, Las Grutas 2, Terrenos 10, Departamentos en Pozo 3); detalle de una propiedad vendida: aparece el formulario de captura y desaparece el botón "Contactar asesor"; footer: los 10 enlaces hiperlocales presentes.
- L15 — Dato a revisar (2026-04-17): los enlaces de barrio del footer apuntan a `210-viviendas`, `don-fernando`, `827-viviendas` y `stefenelli`; en los datos actuales "Stefenelli" no existe y las propiedades de "827 viviendas" y "210 viviendas" están deshabilitadas, por lo que esas búsquedas devuelven 0 resultados hasta que se carguen unidades.
- L16 — Corrección del usuario (2026-04-17): "los enlaces con los numeros de cel en cada propiedad estan bien, pero el mensaje no indica el enlace con la propiedad, solo llega \"Hola! Quiero consultar por la propiedad Terreno en Venta en General Roca (Ref: Venta)\"." → S11 reescrito: el mensaje precompletado ahora incluye el enlace canónico de la unidad en una segunda línea (`generatePropertyInquiryUrl` acepta `propertyUrl`), aplicado tanto en las tarjetas del catálogo como en el botón "Contactar asesor" del detalle.
- L17 — Revisión nativa RDD (2026-04-17): los candidatos `sha256:7d18c182…` y `sha256:d6aff853…` (este último ya con el fix del link de WhatsApp) quedaron sin revisar por decisión humana (**declined**, "Skip this time"); no se creó registro de revisión y las revisiones futuras siguen habilitadas.
- L18 — Requisito del usuario (2026-04-17): "quiero ver solo articulos enlazados por slug. ademas quiero poder elegir a traves de /admin/novedades que articulos poner en el home." → S14 y S15: la home pasa a mostrar únicamente los artículos marcados como destacados desde el admin (enlazados por slug, ordenados por la curaduría) y se eliminan los enlaces a páginas de categoría.
- L19 — Verificación de la curaduría (2026-04-17): round trip real contra la base: `PUT featuredOnHome=true` en un post ⇒ la home mostró solo ese artículo con su link por slug; `PUT featuredOnHome=false` ⇒ la home volvió a mostrar los 3 más recientes. No se dejó ningún post marcado (estado final: sin destacados).
- L20 — Sin curaduría inicial (2026-04-17): no se modificó la base para marcar las tres guías del prompt original (zonificación, trámites e impuestos 2026, escrituración): la selección queda a criterio del usuario desde el admin. Hasta entonces la home muestra los 3 artículos más recientes.
- L21 — Incidencia reportada por el usuario (2026-04-17): "no estan quedando seleccionadas en admin/novedades al dar click en home. no persiste el add". Causa: el `next dev` que estaba corriendo desde antes de los cambios tenía un grafo de módulos parcialmente recargado (el repository ya devolvía los campos nuevos, pero la ruta de actualización no aplicaba el flag), y el toggle del listado actualizaba el estado local de forma optimista, así que la UI mostraba "En home" sin que nada se guardara. Correcciones: (a) el toggle ahora toma el valor de la respuesta del servidor y avisa con un toast si el backend no aplicó el cambio; (b) se reinició el `next dev`. Verificado: `PUT featuredOnHome` responde con el valor real persistido y la home muestra solo el artículo curado.
