# Arquitectura SEO para Propiedades - Technical Design

## 1. Technical Approach

### Overview
Implementar una arquitectura SEO completa para el sitio de propiedades, abarcando 5 fases: unificación de dominio, JSON-LD para detalle de propiedades, JSON-LD para listados, optimización de imágenes, y nueva arquitectura de rutas con soporte para filtros por barrio/tipo/operación.

### Stack Tecnológico
- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **SEO**: Metadata API, JSON-LD, Middleware redirects
- **Schema.org**: RealEstateListing, BreadcrumbList, ItemList

---

## 2. Architecture Decisions

### 2.1 Middleware para Unificación de Dominio

**Decisión**: Implementar redirects en middleware.ts existente en lugar de Next.js config.

**Rationale**:
- Middleware ejecuta antes que la request llegue al servidor
- Mejor performance que redirects en next.config.js
- Mantiene todas las reglas de redirect en un solo lugar
- Soporta redirects condicionales basados en headers (detect HTTP/HTTPS)

```typescript
// Reglas de redirect en middleware:
1. HTTP → HTTPS (permanent)
2. www.riquelmeprop.com → riquelmeprop.com (permanent)
3. /propiedad/[slug] legacy → /propiedades/[barrio]/[slug] (permanent)
```

### 2.2 JSON-LD Strategy

**Decisión**: Generar JSON-LD en el servidor (generateMetadata) y pasarlo al cliente via contexto.

**Rationale**:
- SEO benefit inmediato (Google lee el HTML renderizado)
- No requiere client-side hydration
- Tipado con TypeScript (schema-dts o tipos propios)
- Reutilizable entre páginas de detalle y listados

### 2.3 Nueva Estructura de Rutas

**Decisión**: Cambiar de `/propiedad/[slug]` a `/propiedades/[barrio]/[slug]` Y `/propiedades/[operacion]/[tipo]`

**Rationale**:
- URLs más descriptivas para SEO (keywords en URL)
- Soporta jerarquía de breadcrumbs natural
- Mantener backward compatibility con redirects 301
- El slug sigue siendo único (BBDD), barrio es adicional

### 2.4 Image Alt Text

**Decisión**: Generar alt text desde datos de propiedad en tiempo de build/render.

**Rationale**:
- Alt text dinámico basado en: tipo + operación + barrio + características
- No requiere cambios en BBDD
- Coherencia con schema.org ImageObject

---

## 3. Data Flow Diagrams

### 3.1 Property Detail Flow (Fase 2)
```
Request: /propiedades/[barrio]/[slug]
    ↓
Middleware: Check redirects (legacy URLs)
    ↓
Page (propiedades/[barrio]/[slug]/page.tsx)
    ↓
PropertyService.findBySlug(slug)
    ↓
generateMetadata() → JSON-LD (RealEstateListing)
    ↓
generateViewport() / generateStaticParams()
    ↓
Return Page with SEO metadata
```

### 3.2 Listing Page Flow (Fase 3)
```
Request: /propiedades/venta/casa
    ↓
Page (propiedades/[operacion]/[tipo]/page.tsx)
    ↓
getUiProperties({ type, tipo })
    ↓
generateMetadata() → JSON-LD (ItemList + BreadcrumbList)
    ↓
generatePaginationJsonLd(page, totalPages)
    ↓
Return Page with SEO metadata
```

### 3.3 JSON-LD Generation Flow
```
PropertyUI / Property Data
    ↓
schema-generator.ts (createPropertySchema)
    ↓
Script JSON-LD string
    ↓
<Script type="application/ld+json">
    ↓
Google Bot crawls
```

---

## 4. File Changes Table

| Fase | Archivo | Acción | Descripción |
|------|---------|--------|--------------|
| 1 | `src/middleware.ts` | Modificar | Agregar redirects HTTP→HTTPS, www→non-www, legacy URLs |
| 1 | `src/app/robots.ts` | Modificar | Agregar reglas mejoradas (sitemap dinamico, crawl-delay si aplica) |
| 2 | `src/lib/seo/schemas/property.schema.ts` | Crear | Generador RealEstateListing JSON-LD |
| 2 | `src/lib/seo/schemas/breadcrumb.schema.ts` | Crear | Generador BreadcrumbList JSON-LD |
| 2 | `src/lib/seo/types.ts` | Crear | Tipos TypeScript para schemas |
| 2 | `src/app/(public)/propiedad/[slug]/page.tsx` | Modificar | Agregar JSON-LD al metadata y componente |
| 2 | `src/app/(public)/propiedad/[slug]/layout.tsx` | Crear | Layout con breadcrumbs |
| 3 | `src/lib/seo/schemas/itemlist.schema.ts` | Crear | Generador ItemList JSON-LD |
| 3 | `src/app/(public)/propiedades/[filter]/page.tsx` | Modificar | Agregar JSON-LD listados y pagination |
| 3 | `src/app/(public)/propiedades/[operacion]/[tipo]/page.tsx` | Crear | Nueva ruta para filtros |
| 3 | `src/app/(public)/propiedades/[operacion]/[tipo]/layout.tsx` | Crear | Layout con breadcrumbs |
| 4 | `src/lib/seo/image-alt.ts` | Crear | Utilidad para generar alt text |
| 4 | `src/components/shared/PropertyDetailClient/PropertyDetailClient.tsx` | Modificar | Agregar alt text dinámico a imágenes |
| 5 | `src/app/(public)/propiedades/[barrio]/[slug]/page.tsx` | Crear | Nueva ruta detallada con barrio |
| 5 | `src/app/sitemap.ts` | Modificar | Agregar nuevas URLs al sitemap |
| 5 | `src/lib/seo/url-builder.ts` | Crear | Utilidad para construir URLs canónicas |

---

## 5. Interfaces/Contracts

### 5.1 JSON-LD Types (src/lib/seo/types.ts)

```typescript
export interface RealEstateListingSchema {
  "@context": "https://schema.org";
  "@type": "RealEstateListing";
  name: string;
  description: string;
  url: string;
  datePosted: string;
  image: string[];
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: "AR";
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  offers: {
    "@type": "Offer";
    price: number;
    priceCurrency: string;
    availability: "https://schema.org/InStock";
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface ItemListSchema {
  "@context": "https://schema.org";
  "@type": "ItemList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    url: string;
  }>;
  numberOfItems: number;
}

export interface PaginationSchema {
  "@context": "https://schema.org";
  "@type": "Pagination";
  currentPage: number;
  totalPages: number;
  itemOnPage: number;
}
```

### 5.2 Property Schema Generator (src/lib/seo/schemas/property.schema.ts)

```typescript
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import { RealEstateListingSchema } from "../types";
import { SITE_URL } from "@/lib/config";

export function createPropertySchema(property: PropertyUI): RealEstateListingSchema {
  const operationText = property.operationType === "venta" ? "Venta" : "Alquiler";
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description.slice(0, 5000), // Max 5k chars
    url: `${SITE_URL}/propiedad/${property.slug}`,
    datePosted: new Date().toISOString(),
    image: property.images,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${property.street} ${property.number}`,
      addressLocality: property.cityName || property.barrioName,
      addressRegion: property.provinceName,
      postalCode: property.zipCode,
      addressCountry: "AR",
    },
    ...(property.lat && property.lng && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.lat,
        longitude: property.lng,
      },
    }),
    offers: {
      "@type": "Offer",
      price: property.amount,
      priceCurrency: property.currency,
      availability: "https://schema.org/InStock",
    },
  };
}
```

### 5.3 Breadcrumb Schema Generator

```typescript
import { BreadcrumbListSchema, BreadcrumbItem } from "../types";
import { SITE_URL } from "@/lib/config";

export function createBreadcrumbSchema(
  items: BreadcrumbItem[],
  baseUrl: string = SITE_URL
): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}
```

### 5.4 URL Builder (src/lib/seo/url-builder.ts)

```typescript
import { SITE_URL } from "@/lib/config";

export function buildPropertyUrl(params: {
  barrio?: string;
  tipo?: string;
  operacion?: string;
  slug: string;
}): string {
  const segments = ["/propiedades"];
  
  if (params.barrio) segments.push(params.barrio);
  if (params.operacion) segments.push(params.operacion);
  if (params.tipo) segments.push(params.tipo);
  if (params.slug) segments.push(params.slug);
  
  return `${SITE_URL}${segments.join("/")}`;
}

export function buildListingUrl(operacion: string, tipo?: string): string {
  const path = tipo ? `/propiedades/${operacion}/${tipo}` : `/propiedades/${operacion}`;
  return `${SITE_URL}${path}`;
}

export function getCanonicalPath(pathname: string): string {
  // Remove trailing slash, lowercase, remove duplicate slashes
  return pathname.replace(/\/$/, "").toLowerCase().replace(/\/+/g, "/");
}
```

### 5.5 Image Alt Generator (src/lib/seo/image-alt.ts)

```typescript
import { PropertyUI } from "@/domain/types/PropertyUI.types";

export function generateImageAlt(
  property: PropertyUI,
  imageIndex: number
): string {
  const parts = [
    property.typeName,
    property.operationType === "venta" ? "en venta" : "en alquiler",
  ];
  
  if (property.barrioName) {
    parts.push(`en ${property.barrioName}`);
  }
  
  if (property.cityName && property.cityName !== property.barrioName) {
    parts.push(property.cityName);
  }
  
  if (property.bedrooms > 0) {
    parts.push(`${property.bedrooms} ${property.bedrooms === 1 ? "dormitorio" : "dormitorios"}`);
  }
  
  if (property.bathrooms > 0) {
    parts.push(`${property.bathrooms} ${property.bathrooms === 1 ? "baño" : "baños"}`);
  }
  
  if (property.totalM2 > 0) {
    parts.push(`${property.totalM2}m²`);
  }
  
  const prefix = imageIndex > 0 ? `Foto ${imageIndex + 1}: ` : "";
  return prefix + parts.join(", ") + ". ";
}

export function generateAllImageAlts(property: PropertyUI): string[] {
  return property.images.map((_, index) => generateImageAlt(property, index));
}
```

---

## 6. Testing Strategy

### 6.1 Unit Tests

**Archivos a testear**:
- `src/lib/seo/schemas/*.ts` - Verify JSON-LD output matches schema.org
- `src/lib/seo/url-builder.ts` - URL construction correctness
- `src/lib/seo/image-alt.ts` - Alt text generation

**Ejemplo de test**:
```typescript
// src/lib/seo/__tests__/property.schema.test.ts
import { createPropertySchema } from "../schemas/property.schema";

describe("createPropertySchema", () => {
  it("generates valid RealEstateListing schema", () => {
    const mockProperty = {
      title: "Casa en Venta",
      slug: "casa-en-venta",
      operationType: "venta" as const,
      // ... full mock
    };
    
    const schema = createPropertySchema(mockProperty);
    
    expect(schema["@type"]).toBe("RealEstateListing");
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema.address).toBeDefined();
    expect(schema.geo).toBeDefined();
  });
});
```

### 6.2 Integration Tests

- **Redirects**: Verificar que middleware responde correctamente a HTTP, www, y legacy URLs
- **Sitemap**: Validar que todas las propiedades generan URLs válidas
- **Metadata**: Verificar que generateMetadata retorna valores esperados

```bash
# Test redirects
curl -I http://riquelmeprop.com  # → 301 → https://riquelmeprop.com
curl -I http://www.riquelmeprop.com  # → 301 → https://riquelmeprop.com
curl -I https://riquelmeprop.com/propiedad/casa-test  # → 301 → /propiedades/...
```

### 6.3 SEO Validation

- **Google Rich Results Test**: Validar JSON-LD para RealEstateListing
- **Schema Markup Validator**: Verificar todos los schemas
- **Lighthouse SEO**: Score > 90

---

## 7. Migration/Rollout Plan

### Fase 1: Unificación de Dominio (Semana 1)
1. Modificar `middleware.ts` para redirects
2. Testear en staging con curl
3. Deploy a producción
4. Verificar en Google Search Console

### Fase 2: JSON-LD Detalle (Semana 2)
1. Crear archivos en `src/lib/seo/schemas/`
2. Modificar página de detalle existente
3. Testear con Google Rich Results Test
4. Deploy

### Fase 3: JSON-LD Listados (Semana 3)
1. Crear schema para ItemList
2. Modificar páginas de listado
3. Crear nueva ruta `/propiedades/[operacion]/[tipo]`
4. Testear pagination schema

### Fase 4: Optimización de Imágenes (Semana 4)
1. Crear utilidad de alt text
2. Modificar componentes de imagen
3. Verificar en Lighthouse

### Fase 5: Arquitectura de Rutas (Semana 5)
1. Crear nuevas rutas con barrio en URL
2. Agregar redirects para legacy URLs
3. Actualizar sitemap
4. Full deploy y verificación

### Rollback Plan
- Cada fase puede ser desactivada individualmente
- Mantener siempre los redirects 301 activos
- Si JSON-LD causa errores, remover scripts del layout
- En caso de rollback total: restaurar `middleware.ts` y páginas anteriores

---

## 8. Considerations

### Performance
- JSON-LD se genera en server-side (no impacta Client Bundle)
- Sitemap con `revalidate: 86400` (24h) para evitar sobrecarga
- Middleware redirect usa Edge Runtime por defecto

### SEO Impact
- Redirects 301 preservan link equity
- Nueva arquitectura de URLs requiere tiempo para indexación
- Breadcrumbs mejoran UX y estructura de búsqueda

### Maintainability
- Esquemas separados por tipo (property, breadcrumb, itemlist)
- Tipos TypeScript compartidos
- Utilidades reutilizables en `src/lib/seo/`
