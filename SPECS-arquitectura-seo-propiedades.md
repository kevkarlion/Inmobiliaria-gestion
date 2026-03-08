# Delta Specs: Arquitectura SEO Propiedades

## Change: arquitectura-seo-propiedades

This document contains delta specifications for all 5 phases of the SEO architecture project for Riquelme Propiedades real estate application.

---

# SEO/Domain

## ADDED Requirements

### Requirement: HTTP to HTTPS Redirection

The system MUST redirect all HTTP requests to their HTTPS equivalent using HTTP 301 (Permanent Redirect) status code.

#### Scenario: HTTP request to property detail page

- GIVEN a user requests `http://riquelmeprop.com/property/casa-en-venta`
- WHEN the request arrives at the server
- THEN the system MUST respond with HTTP 301 status code
- AND MUST redirect to `https://riquelmeprop.com/property/casa-en-venta`

#### Scenario: HTTP request to list page

- GIVEN a user requests `http://riquelmeprop.com/propiedades/venta`
- WHEN the request arrives at the server
- THEN the system MUST respond with HTTP 301 status code
- AND MUST redirect to `https://riquelmeprop.com/propiedades/venta`

#### Scenario: HTTP root domain request

- GIVEN a user requests `http://riquelmeprop.com/`
- WHEN the request arrives at the server
- THEN the system MUST respond with HTTP 301 status code
- AND MUST redirect to `https://riquelmeprop.com/`

#### Edge Case: HTTP request with query parameters

- GIVEN a user requests `http://riquelmeprop.com/propiedades/venta?page=2`
- WHEN the request arrives at the server
- THEN the system MUST preserve the query string in the redirect
- AND MUST redirect to `https://riquelmeprop.com/propiedades/venta?page=2`

### Requirement: www to non-www Redirection

The system MUST redirect all www subdomain requests to the bare domain using HTTP 301 (Permanent Redirect) status code.

#### Scenario: www request to property detail page

- GIVEN a user requests `https://www.riquelmeprop.com/property/casa-en-venta`
- WHEN the request arrives at the server
- THEN the system MUST respond with HTTP 301 status code
- AND MUST redirect to `https://riquelmeprop.com/property/casa-en-venta`

#### Scenario: www request to root

- GIVEN a user requests `https://www.riquelmeprop.com/`
- WHEN the request arrives at the server
- THEN the system MUST respond with HTTP 301 status code
- AND MUST redirect to `https://riquelmeprop.com/`

### Requirement: Enhanced Robots.txt Configuration

The system MUST generate an enhanced robots.txt file that includes pagination crawl-delay recommendations and specific rules for search engine crawlers.

#### Scenario: Default robots.txt request

- GIVEN a search engine bot requests `/robots.txt`
- WHEN the server processes the request
- THEN the system MUST return a robots.txt with User-agent: * rules
- AND MUST include `Allow: /` for all pages
- AND MUST include `Disallow: /admin` for admin routes
- AND MUST include `Disallow: /api/` for API routes
- AND MUST reference the sitemap at `https://riquelmeprop.com/sitemap.xml`

#### Scenario: Pagination crawl rules in robots.txt

- GIVEN a search engine bot requests `/robots.txt`
- WHEN the server processes the request
- THEN the system SHOULD include comment guidance suggesting `Crawl-delay: 1` for aggressive crawlers
- AND SHOULD document pagination patterns that should be crawled sparingly (e.g., `/propiedades/venta?page=[5-]`)

### Requirement: Hreflang Tags for Language/Region

The system MUST include hreflang tags in the `<head>` of all property detail pages to indicate the language and regional targeting.

#### Scenario: Property detail page hreflang

- GIVEN a user visits `/propiedad/casa-moderna-en-venta`
- WHEN the page renders
- THEN the system MUST include `<link rel="alternate" hreflang="es-AR" href="https://riquelmeprop.com/propiedad/casa-moderna-en-venta" />`
- AND MUST include `<link rel="alternate" hreflang="x-default" href="https://riquelmeprop.com/propiedad/casa-moderna-en-venta" />`

#### Scenario: List page hreflang

- GIVEN a user visits `/propiedades/venta`
- WHEN the page renders
- THEN the system MUST include hreflang tags for Spanish Argentina locale

---

# SEO/StructuredData

## ADDED Requirements

### Requirement: RealEstateListing JSON-LD for Property Detail Pages

The system MUST inject JSON-LD structured data using the RealEstateListing schema type on all property detail pages.

#### Scenario: Property detail page with all fields populated

- GIVEN a property exists with title "Casa Moderna en Venta", price 150000 USD, 3 bedrooms, 2 bathrooms, 150 totalM2, coveredM2 120, located at "San Martín 123" in "Barrio Norte"
- WHEN the property detail page renders at `/propiedad/casa-moderna-en-venta`
- THEN the system MUST include a `<script type="application/ld+json">` in the `<head>`
- AND the schema MUST include `@context: "https://schema.org"`
- AND the schema MUST include `@type: "RealEstateListing"`
- AND the schema MUST include `name: "Casa Moderna en Venta"`
- AND the schema MUST include `url: "https://riquelmeprop.com/propiedad/casa-moderna-en-venta"`
- AND the schema MUST include `description` with the property description text
- AND the schema MUST include `datePosted` with the property creation date
- AND the schema MUST include `price` with value 150000 and currency "USD"
- AND the schema MUST include `priceCurrency: "USD"`
- AND the schema MUST include `address` with streetAddress, addressLocality (city), addressRegion (province), postalCode
- AND the schema MUST include `geo` with latitude and longitude
- AND the schema MUST include `floorSize` with value 150 and unitCode "MTK"
- AND the schema MUST include `numberOfRooms: 3`
- AND the schema MUST include `numberOfBathroomsTotal: 2`
- AND the schema MUST include `image` array with all property image URLs
- AND the schema MUST include `offers` with price, priceCurrency, availability

#### Scenario: Property with rental operation type

- GIVEN a property has operationType "alquiler" with price 500 USD monthly
- WHEN the property detail page renders
- THEN the schema MUST include `offers` with `price: 500`, `priceCurrency: "USD"`, `availability: "https://schema.org/InStock"`, AND `unitCode: "MON"` for monthly rental

#### Scenario: Property missing optional fields

- GIVEN a property exists without location coordinates, without barrio, without coveredM2
- WHEN the property detail page renders
- THEN the schema MUST still render with all available fields
- AND MUST NOT include empty or null values for geo, floorSize
- AND MUST use "General Roca" as default addressLocality when city is not populated

### Requirement: BreadcrumbList JSON-LD for Property Detail Pages

The system MUST include BreadcrumbList structured data on all property detail pages to improve search engine understanding of page hierarchy.

#### Scenario: Breadcrumb for property in neighborhood

- GIVEN a property is located in barrio "Barrio Norte", city "General Roca", operationType "venta"
- WHEN the property detail page renders at `/propiedad/casa-en-venta`
- THEN the system MUST include BreadcrumbList schema with:
  - Item 1: Home → "https://riquelmeprop.com/"
  - Item 2: Propiedades → "https://riquelmeprop.com/propiedades/venta"
  - Item 3: Barrio Norte → "https://riquelmeprop.com/propiedades/venta/barrio-norte"
  - Item 4: Casa en Venta (current page)

#### Scenario: Breadcrumb for property without barrio

- GIVEN a property exists without barrio assigned, operationType "alquiler"
- WHEN the property detail page renders
- THEN the breadcrumb MUST skip the neighborhood level
- AND MUST show: Home → Propiedades → Alquiler → Property Title

### Requirement: ItemList JSON-LD for Property List Pages

The system MUST include ItemList structured data on all property list pages (venta, alquiler, oportunidad).

#### Scenario: ItemList for venta page with 20 properties

- GIVEN the /propiedades/venta page returns 20 properties
- WHEN the list page renders
- THEN the system MUST include ItemList schema with:
  - `@context: "https://schema.org"`
  - `@type: "ItemList"`
  - `itemListElement` array with 20 items
  - Each item MUST include `@type: "ListItem"`
  - Each item MUST include `position` (1-20)
  - Each item MUST include `url` pointing to property detail page
  - Each item SHOULD include `name` with property title

#### Scenario: ItemList with pagination metadata

- GIVEN the /propiedades/venta?page=2 page returns properties 21-40
- WHEN the list page renders
- THEN the system MUST include ItemList schema with:
  - `numberOfItems: 20`
  - `itemListElement` for positions 21-40
  - SHOULD include `nextItem` link to page 3
  - SHOULD include `previousItem` link to page 1

#### Scenario: Empty results list page

- GIVEN the /propiedades/venta page returns 0 properties
- WHEN the list page renders
- THEN the system SHOULD still include ItemList schema with empty `itemListElement` array
- AND SHOULD NOT include JSON-LD if no properties exist

### Requirement: CollectionPage Schema for List Pages

The system MUST include CollectionPage schema type for all property list pages.

#### Scenario: CollectionPage for filtered list

- GIVEN a user visits `/propiedades/venta`
- WHEN the page renders
- THEN the system MUST include `@type: "CollectionPage"` in the JSON-LD
- AND MUST include `mainEntity` referencing the ItemList

---

# SEO/Metadata

## ADDED Requirements

### Requirement: Image Metadata Optimization

The system MUST include comprehensive image metadata for all property images to improve image search visibility.

#### Scenario: Property with multiple images

- GIVEN a property has 5 images with URLs in the images array
- WHEN the property detail page renders
- THEN each image in OpenGraph and Twitter metadata MUST have defined width and height
- AND the system SHOULD use the first image as og:image with 1200x630 dimensions
- AND additional images SHOULD be included in og:image array up to 6 images

#### Scenario: Property without images

- GIVEN a property has empty images array
- WHEN the property detail page renders
- THEN the system MUST NOT include og:image metadata
- AND MUST include a fallback image from config if available

### Requirement: Alt Text from Property Data

The system MUST generate descriptive alt text for property images derived from property data fields.

#### Scenario: Generate alt text from property fields

- GIVEN a property has title "Casa Moderna", operationType "venta", barrio "Centro", city "General Roca"
- WHEN the property detail page renders
- THEN image alt text SHOULD be generated as "Casa Moderna en venta en Centro, General Roca"
- AND subsequent images SHOULD append image index: "Casa Moderna en venta en Centro, General Roca - Imagen 2"

#### Scenario: Property with existing alt text in database

- GIVEN a property image entry includes custom alt text in the images array
- WHEN the property detail page renders
- THEN the system MUST use the custom alt text from the database
- AND MUST NOT overwrite with generated alt text

### Requirement: Dynamic Meta Tags for New Routes

The system MUST generate appropriate meta tags for new URL patterns created in Phase 5.

#### Scenario: Neighborhood route meta tags

- GIVEN a user visits `/propiedades/centro` (barrio route)
- WHEN the metadata generates
- THEN title SHOULD be "Propiedades en Centro - General Roca | Riquelme Propiedades"
- AND description SHOULD be "Encontrá propiedades en venta y alquiler en Centro, General Roca. Casa, departamento y más."
- AND canonical MUST be `https://riquelmeprop.com/propiedades/centro`

#### Scenario: Operation + PropertyType route meta tags

- GIVEN a user visits `/propiedades/venta/departamento`
- WHEN the metadata generates
- THEN title SHOULD be "Departamentos en venta - General Roca | Riquelme Propiedades"
- AND description SHOULD mention both operation and property type

---

# Routes

## ADDED Requirements

### Requirement: Neighborhood-Based Property Routes

The system MUST support URL pattern `/propiedades/[barrio]` for viewing properties filtered by neighborhood.

#### Scenario:访问barrio页面

- GIVEN a user navigates to `/propiedades/centro`
- WHEN the page loads
- THEN the system MUST display all properties where `address.barrio.slug = "centro"`
- AND MUST return 404 if barrio does not exist
- AND MUST include pagination after 20 properties

#### Scenario:访问不存在的barrio

- GIVEN a user navigates to `/propiedades/barrio-inexistente`
- WHEN the system queries for properties in this barrio
- THEN the system SHOULD return 404 page
- AND SHOULD NOT create indexed pages for non-existent barrios

### Requirement: Combined Operation and PropertyType Routes

The system MUST support URL pattern `/propiedades/[operacion]/[tipo-propiedad]` for filtered views.

#### Scenario:访问venta + tipo-propiedad

- GIVEN a user navigates to `/propiedades/venta/departamento`
- WHEN the page loads
- THEN the system MUST display properties with operationType "venta" AND propertyType slug "departamento"
- AND valid operation types are: "venta", "alquiler"
- AND valid property type slugs are: "casa", "departamento", "terreno", "local", "ph", "galpon", "duplex", "otro"

#### Scenario: Invalid operation type in URL

- GIVEN a user navigates to `/propiedades/invalido/departamento`
- WHEN the page loads
- THEN the system MUST return 404

### Requirement: Legacy URL Redirections

The system MUST implement 301 redirects from legacy URL patterns to new SEO-friendly patterns.

#### Scenario: Old filter URL to new format

- GIVEN a user visits `/propiedad?filter=venta`
- WHEN the request arrives
- THEN the system MUST redirect with 301 to `/propiedades/venta`

#### Scenario: Legacy detail URL with ID

- GIVEN a user visits `/propiedad/123/casa-en-venta`
- WHEN the request arrives
- THEN the system SHOULD redirect with 301 to `/propiedad/casa-en-venta` (using slug)

#### Scenario: Old category URL pattern

- GIVEN a user visits `/buscar?tipo=casa&operacion=venta`
- WHEN the request arrives
- THEN the system MUST redirect with 301 to `/propiedades/venta/casa`

### Requirement: Sitemap Integration for New Routes

The system MUST include new routes in the sitemap.xml file.

#### Scenario: Include barrio routes in sitemap

- GIVEN 10 active barrios exist in the database
- WHEN sitemap generates
- THEN the sitemap MUST include entries for each barrio route `/propiedades/[barrio-slug]`
- AND each entry MUST have changeFrequency "daily" and priority 0.7

#### Scenario: Include operation + type routes in sitemap

- GIVEN property types "casa", "departamento", "terreno" exist
- WHEN sitemap generates for venta operation
- THEN the sitemap MUST include `/propiedades/venta/casa`, `/propiedades/venta/departamento`, `/propiedades/venta/terreno`
- AND same for alquiler operation

### Requirement: Breadcrumb Schema for New Routes

The system MUST include BreadcrumbList structured data on new route pages.

#### Scenario: Breadcrumb for /propiedades/[barrio]

- GIVEN a user visits `/propiedades/centro`
- WHEN the page renders
- THEN breadcrumb schema MUST show: Home → Propiedades → Centro

#### Scenario: Breadcrumb for /propiedades/[operacion]/[tipo]

- GIVEN a user visits `/propiedades/venta/departamento`
- WHEN the page renders
- THEN breadcrumb schema MUST show: Home → Propiedades → Venta → Departamento

---

# Performance

## ADDED Requirements

### Requirement: Structured Data Performance

The system MUST ensure JSON-LD does not negatively impact page load performance.

#### Scenario: JSON-LD rendering timing

- GIVEN a property detail page renders
- WHEN the page completes loading
- THEN the JSON-LD script MUST be present in the initial HTML (not loaded asynchronously)
- AND JSON-LD size SHOULD NOT exceed 10KB per page

#### Scenario: Multiple schemas on same page

- GIVEN a property detail page includes both RealEstateListing and BreadcrumbList
- WHEN the page renders
- THEN both schemas MAY be combined in a single `@graph` array
- OR MAY be separate script tags

---

# Summary

| Phase | Domain | Requirements | Scenarios |
|-------|--------|-------------|-----------|
| 1 | SEO/Domain | 4 | 10 |
| 2 | SEO/StructuredData | 2 | 7 |
| 3 | SEO/StructuredData | 2 | 4 |
| 4 | SEO/Metadata | 3 | 5 |
| 5 | Routes | 5 | 12 |

**Total Requirements**: 16
**Total Scenarios**: 38

### Coverage
- Happy paths: Covered (all main flows)
- Edge cases: Covered (missing fields, empty results, invalid URLs, 404s)
- Error states: Covered (invalid operations, non-existent barrios)
