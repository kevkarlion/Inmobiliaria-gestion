/**
 * Pluraliza el slug del tipo de propiedad para URLs SEO.
 * Ejemplos: departamento → departamentos, casa → casas
 * Maneja tipos compuestos como departamento-en-pozo → departamentos-en-pozo
 */
export function pluralizeSlug(slug: string): string {
  // Si ya está en plural (termina en 's' y no es un caso especial), devolver tal cual
  // Esto evita duplicar la 's' como loteos → loteoss
  if (slug.endsWith("s") && slug.length > 1) {
    return slug;
  }

  const pluralMap: Record<string, string> = {
    departamento: "departamentos",
    casa: "casas",
    terreno: "terrenos",
    lote: "lotes",
    local: "locales",
    oficina: "oficinas",
    PH: "PHs",
    galpon: "galpones",
    fundo: "fundos",
    loteo: "loteos",
    // Tipos compuestos
    "departamento-en-pozo": "departamentos-en-pozo",
  };

  // Si está en el mapa, usar el valor directo
  if (pluralMap[slug]) {
    return pluralMap[slug];
  }

  // Para casos no mapeados, agregar 's' al final
  return `${slug}s`;
}

/**
 * Convierte un slug plural a singular para búsqueda en base de datos.
 * Ejemplos: departamentos → departamento, casas → casa
 * Maneja tipos compuestos como departamentos-en-pozo → departamento-en-pozo
 */
export function singularizeSlug(slug: string): string {
  const singularMap: Record<string, string> = {
    departamentos: "departamento",
    casas: "casa",
    terrenos: "terreno",
    lotes: "lote",
    locales: "local",
    oficinas: "oficina",
    PHs: "PH",
    galpones: "galpon",
    fundos: "fundo",
    loteos: "loteo",
    // Tipos compuestos
    "departamentos-en-pozo": "departamento-en-pozo",
  };

  // Si está en el mapa directo, usarlo
  if (singularMap[slug]) {
    return singularMap[slug];
  }

  // Si ya está en singular, devolver tal cual
  const alreadySingular = ["departamento", "casa", "terreno", "lote", "local", "oficina", "PH", "galpon", "fundo", "loteo", "departamento-en-pozo"];
  if (alreadySingular.includes(slug)) {
    return slug;
  }

  // Si no está en el mapa, intentar remover la 's' final
  if (slug.endsWith("s") && slug.length > 1) {
    return slug.slice(0, -1);
  }

  return slug;
}

/**
 * Genera la URL SEO para listados por tipo de propiedad, operación y ciudad.
 * Formato: /{tipoplural}-en-{operación}-{ciudad}
 * Ejemplos: /casas-en-venta-general-roca, /departamentos-en-alquiler-neuquen
 */
export function buildSeoListingUrl(
  propertyTypeSlug: string,
  operation: "venta" | "alquiler",
  citySlug: string
): string {
  const pluralTypeSlug = pluralizeSlug(propertyTypeSlug);
  return `/${pluralTypeSlug}-en-${operation}-${citySlug}`;
}

/** Parsea un slug de listado SEO. Retorna null si no coincide con el patrón.
 * Convierte automáticamente el slug plural a singular para compatibilidad con la base de datos.
 */
export function parseSeoListingSlug(
  slug: string
): { typeSlug: string; operation: "venta" | "alquiler"; citySlug: string } | null {
  const match = slug.match(/^(.+?)-en-(venta|alquiler)-(.+)$/);
  if (!match) return null;
  const [, typeSlug, operation, citySlug] = match;
  if (!typeSlug || !citySlug) return null;

  // Convertir plural a singular para compatibilidad con la base de datos
  const singularTypeSlug = singularizeSlug(typeSlug);

  return { typeSlug: singularTypeSlug, operation: operation as "venta" | "alquiler", citySlug };
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
