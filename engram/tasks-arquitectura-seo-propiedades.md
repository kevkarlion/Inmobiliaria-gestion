# Tasks: Arquitectura SEO Propiedades

## Phase 1: Foundation - Domain Unification

Foundation tasks that create infrastructure other phases depend on.

- [ ] 1.1 Add HTTP to HTTPS 301 redirect in `src/middleware.ts`
- [ ] 1.2 Add www to non-www 301 redirect in `src/middleware.ts`
- [ ] 1.3 Add query parameter preservation for redirects in `src/middleware.ts`
- [ ] 1.4 Enhance `public/robots.txt` with crawl-delay guidance and pagination rules
- [ ] 1.5 Add hreflang metadata in `src/app/(public)/layout.tsx`

## Phase 2: Core - JSON-LD Schema Generators

Core logic for generating structured data. Depends on Phase 1.

- [ ] 2.1 Create `src/server/services/seo/json-ld.service.ts` with `generateRealEstateListing()` function
- [ ] 2.2 Create `src/server/services/seo/json-ld.service.ts` with `generateBreadcrumbList()` for detail pages
- [ ] 2.3 Create `src/server/services/seo/json-ld.service.ts` with `generateItemList()` for listing pages
- [ ] 2.4 Create `src/server/services/seo/json-ld.service.ts` with `generateBreadcrumbList()` for listing pages
- [ ] 2.5 Create `src/server/services/seo/types.ts` with TypeScript interfaces for Schema.org types

## Phase 3: Integration - Property Detail Pages

Integrate JSON-LD into existing property detail pages. Depends on Phase 2.

- [ ] 3.1 Add RealEstateListing JSON-LD to `src/app/(public)/propiedad/[slug]/page.tsx`
- [ ] 3.2 Add BreadcrumbList JSON-LD to `src/app/(public)/propiedad/[slug]/page.tsx`
- [ ] 3.3 Add fallback handling for missing optional fields in schema generation
- [ ] 3.4 Enhance OpenGraph image metadata in `src/app/(public)/propiedad/[slug]/page.tsx`

## Phase 4: Integration - Listing Pages

Integrate JSON-LD into listing pages. Depends on Phase 2.

- [ ] 4.1 Add ItemList JSON-LD to `src/app/(public)/propiedades/[filter]/page.tsx`
- [ ] 4.2 Add BreadcrumbList JSON-LD to `src/app/(public)/propiedades/[filter]/page.tsx`
- [ ] 4.3 Add pagination metadata to ItemList schema in `src/app/(public)/propiedades/[filter]/page.tsx`
- [ ] 4.4 Add ItemList JSON-LD to `src/app/(public)/properties/page.tsx`
- [ ] 4.5 Add canonical URL pointing from `/properties` to `/propiedades` in `src/app/(public)/properties/page.tsx`

## Phase 5: Image Optimization

Optimize images with metadata and alt text. Depends on Phase 3.

- [ ] 5.1 Create `src/server/services/seo/image.service.ts` with `generateAltText()` function
- [ ] 5.2 Add dynamic alt text generation to `src/app/(public)/propiedad/[slug]/page.tsx`
- [ ] 5.3 Add custom alt text fallback from database images in `src/server/services/seo/image.service.ts`

## Phase 6: Route Architecture - Neighborhood Routes

Create new URL structure for barrio-based routes. Depends on Phase 4.

- [ ] 6.1 Create `src/app/(public)/propiedades/[barrio]/page.tsx` for `/propiedades/[barrio]` route
- [ ] 6.2 Add filter logic to query properties by barrio slug in new page
- [ ] 6.3 Add metadata (title, description, canonical) to new barrio route
- [ ] 6.4 Add ItemList and BreadcrumbList JSON-LD to `src/app/(public)/propiedades/[barrio]/page.tsx`
- [ ] 6.5 Add 404 handling for non-existent barrios in new route

## Phase 7: Route Architecture - Operation/Type Routes

Create new URL structure for operation/type routes. Depends on Phase 6.

- [ ] 7.1 Create `src/app/(public)/propiedades/[operacion]/[tipo]/page.tsx` for combined routes
- [ ] 7.2 Add filter logic for operation + propertyType in new page
- [ ] 7.3 Add metadata (title, description, canonical) to operation/type route
- [ ] 7.4 Add ItemList and BreadcrumbList JSON-LD to `src/app/(public)/propiedades/[operacion]/[tipo]/page.tsx`
- [ ] 7.5 Add 404 handling for invalid operation types

## Phase 8: Legacy URL Redirects

Implement 301 redirects from old URL patterns. Depends on Phase 6.

- [ ] 8.1 Add legacy filter redirect (`/propiedad?filter=venta` → `/propiedades/venta`) in `src/middleware.ts`
- [ ] 8.2 Add legacy ID-based URL redirect (`/propiedad/123/slug` → `/propiedad/slug`) in `src/middleware.ts`
- [ ] 8.3 Add legacy buscar redirect (`/buscar?tipo=casa&operacion=venta` → `/propiedades/venta/casa`) in `src/middleware.ts`
- [ ] 8.4 Add `/properties` → `/propiedades/venta` canonical redirect in `src/middleware.ts`

## Phase 9: Testing

Verify implementation against spec scenarios.

- [ ] 9.1 Test HTTP to HTTPS redirect using curl (spec scenario: HTTP request to property detail)
- [ ] 9.2 Test www to non-www redirect using curl (spec scenario: www request to root)
- [ ] 9.3 Validate RealEstateListing JSON-LD at `/propiedad/[slug]` with Google Rich Results Test
- [ ] 9.4 Validate ItemList JSON-LD at `/propiedades/venta` with Google Rich Results Test
- [ ] 9.5 Test breadcrumb structure at property detail page
- [ ] 9.6 Test new `/propiedades/centro` route returns 404 for non-existent barrio
- [ ] 9.7 Test new `/propiedades/venta/departamento` route with valid filters
- [ ] 9.8 Test legacy redirects return 301 status codes
- [ ] 9.9 Run `npm run build` and verify no errors
- [ ] 9.10 Verify hreflang tags present in page source

## Phase 10: Cleanup

Documentation and polish.

- [ ] 10.1 Remove any temporary debug code from middleware
- [ ] 10.2 Document JSON-LD schema structure in code comments
- [ ] 10.3 Verify all new routes added to sitemap (manual check in `/sitemap.xml`)
