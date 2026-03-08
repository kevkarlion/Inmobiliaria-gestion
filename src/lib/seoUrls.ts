/**
 * Genera la URL SEO para listados por tipo de propiedad, operación y ciudad.
 * Formato: /{tipo}-en-{operación}-{ciudad}
 * Ejemplos: /casas-en-venta-general-roca, /departamentos-en-alquiler-neuquen
 */
export function buildSeoListingUrl(
  propertyTypeSlug: string,
  operation: "venta" | "alquiler",
  citySlug: string
): string {
  return `/${propertyTypeSlug}-en-${operation}-${citySlug}`;
}

/** Parsea un slug de listado SEO. Retorna null si no coincide con el patrón. */
export function parseSeoListingSlug(
  slug: string
): { typeSlug: string; operation: "venta" | "alquiler"; citySlug: string } | null {
  const match = slug.match(/^(.+?)-en-(venta|alquiler)-(.+)$/);
  if (!match) return null;
  const [, typeSlug, operation, citySlug] = match;
  if (!typeSlug || !citySlug) return null;
  return { typeSlug, operation: operation as "venta" | "alquiler", citySlug };
}

export type OperationSlug = "venta" | "alquiler";

/** Ciudad para el menú (slug + nombre para mostrar) */
export interface CityOption {
  slug: string;
  name: string;
}

/** Por cada tipo de propiedad: nombre para mostrar y ciudades con stock */
export interface TypeMenuEntry {
  typeSlug: string;
  typeName: string;
  cities: CityOption[];
}

/** Estructura del menú: operación → tipo → ciudades */
export interface NavMenuStructure {
  venta: TypeMenuEntry[];
  alquiler: TypeMenuEntry[];
}
