# Proposal: arquitectura-seo-propiedades

## Intent

This change is needed to enhance SEO performance for property listings by implementing JSON-LD Structured Data (Schema.org) and optimizing the URL architecture. The current implementation has basic SEO (metadata, canonical URLs, OpenGraph, sitemap) but lacks structured data that helps search engines understand property-specific content, which is critical for real estate listings to appear in rich results (Rich Snippets).

## Scope

### In Scope

#### Fase 1: Unificación de Dominio y Robots.txt
- Redirecciones 301 (HTTP → HTTPS, www → non-www)
- Configuración de robots.txt
- hreflang tags para español/inglés

#### Fase 2: JSON-LD para Páginas de Detalle
- JSON-LD `RealEstateListing` schema for property detail pages (`/propiedad/[slug]`)
- JSON-LD `BreadcrumbList` schema para páginas de detalle
- Map property fields to Schema.org properties:
  - `name` → property title
  - `description` → property description
  - `url` → canonical URL
  - `image` → property images array
  - `address` → full address with streetAddress, addressLocality, addressRegion
  - `geo` → latitude/longitude
  - `price` → price amount and currency
  - `priceCurrency` → ISO currency code
  - `offers` → availability, priceSpecification

#### Fase 3: JSON-LD para Páginas de Listados
- JSON-LD `ItemList` schema for listing pages (`/propiedades/[filter]`, `/properties`)
- Paginación en structured data
- BreadcrumbList schema para páginas de listados

#### Fase 4: Optimización de Imágenes y Metadatos
- Image metadata optimization
- Alt text desde datos de propiedad

#### Fase 5: Arquitectura de Rutas por Barrios y Categorías
- Nuevas rutas: `/propiedades/[barrio]/[slug]`
- Nuevas rutas: `/propiedades/[tipo-operacion]/[tipo-propiedad]`
- Breadcrumb schema para nuevas rutas
- Redirecciones 301 desde URLs legacy
- Gestión de canonical URLs entre diferentes estructuras de URL

### Out of Scope
- Sitemap performance optimization (deferred to future)
- ISR implementation with generateStaticParams (deferred to future)

## Approach

### Technical Implementation

#### Fase 1: Unificación de Dominio
- Configurar Next.js middleware para redirecciones 301
- Crear/actualizar robots.txt con directivas correctas
- Agregar hreflang en metadata para /es y /en (si aplica)

#### Fase 2: RealEstateListing Schema (Property Detail Pages)
- Add JSON-LD script in `/src/app/(public)/propiedad/[slug]/page.tsx`
- Use Next.js `script` component with `ld+json` type for SEO-friendly injection

#### Fase 3: ItemList Schema (Listing Pages)
- Implement for `/propiedades/[filter]` and `/properties`
- Include: `itemListElement` with position, name, url for each property
- Add `numberOfItems` from pagination metadata

#### Fase 4: Optimización de Imágenes
- Agregar metadata a imágenes: width, height, format
- Generar alt text dinámicamente desde datos de propiedad

#### Fase 5: Arquitectura de Rutas
- Crear nueva estructura de rutas en `/src/app/(public)/propiedades/[barrio]/[slug]/page.tsx`
- Crear nueva estructura de rutas en `/src/app/(public)/propiedades/[tipo-operacion]/[tipo-propiedad]/page.tsx`
- Implementar redirecciones 301 desde rutas legacy
- Gestión de canonical URLs entre /properties y /propiedades/[filter]

### Data Flow
```
PropertyService.findBySlug() → Property detail page → generateJsonLd() → <Script ld+json>
PropertyService.findAll() → Listing page → generateBreadcrumbJsonLd() / generateItemListJsonLd() → <Script ld+json>
```

## Affected Areas

| File | Change Type |
|------|-------------|
| `src/middleware.ts` | Add 301 redirects for domain unification |
| `public/robots.txt` | Update robots.txt configuration |
| `src/app/(public)/propiedad/[slug]/page.tsx` | Add RealEstateListing + BreadcrumbList JSON-LD |
| `src/app/(public)/propiedades/[barrio]/[slug]/page.tsx` | New route for neighborhood-based URLs |
| `src/app/(public)/propiedades/[tipo-operacion]/[tipo-propiedad]/page.tsx` | New route for operation/category URLs |
| `src/app/(public)/propiedades/[filter]/page.tsx` | Add ItemList + BreadcrumbList JSON-LD + canonical URLs |
| `src/app/(public)/properties/page.tsx` | Add ItemList + BreadcrumbList JSON-LD + canonical URLs |
| `src/server/services/property.service.ts` | Add helper methods for schema generation |
| `src/app/layout.tsx` | Add hreflang tags |

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Sitemap performance at scale | Medium | Medium | Monitor sitemap generation time; implement caching; consider pagination in sitemap.xml |
| Duplicate content SEO penalty | Medium | Medium | Implement canonical URLs on `/properties` pointing to `/propiedades`; use `noindex` on one variant |
| JSON-LD validation errors | Low | High | Use TypeScript interfaces matching Schema.org; validate with Google Rich Results Test before deployment |
| Invalid/missing property data causing schema errors | Low | Medium | Add fallback values; add validation before rendering JSON-LD |
| Client-side schema causing CLS | Low | Low | Use Next.js `Script` with `strategy="afterInteractive"` or `strategy="lazyOnload"` |
| Migration to new URL structure causing SEO drop | Medium | High | Implement 301 redirects for ALL legacy URLs; monitor Search Console closely |

## Rollback Plan

1. **Revert file changes**: Restore original versions of affected page files
2. **Remove redirects**: Restore previous middleware configuration
3. **No database changes**: This change only affects frontend rendering, no migration needed
4. **Verification**: Run `npm run build` and verify pages load without JSON-LD errors
5. **Monitoring**: Check Google Search Console for schema errors post-rollback

## Success Criteria

- [ ] JSON-LD validates in Google Rich Results Test for property detail pages
- [ ] JSON-LD validates for listing pages (ItemList)
- [ ] Breadcrumbs appear correctly in Google search results
- [ ] Redirecciones 301 funcionando correctamente (HTTP→HTTPS, www→non-www)
- [ ] hreflang tags configurados y validados
- [ ] Nuevas rutas de barrios y categorías funcionando
- [ ] Redirecciones 301 desde URLs legacy configuradas
- [ ] Canonical URLs entre /properties y /propiedades configurados
- [ ] No console errors on property pages
- [ ] Lighthouse SEO score maintains or improves
- [ ] Build completes without errors (`npm run build`)
- [ ] No regression in existing metadata implementation
