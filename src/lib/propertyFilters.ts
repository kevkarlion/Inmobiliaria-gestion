/**
 * Helpers de filtrado de propiedades usados por la capa de datos y por las
 * páginas públicas (catálogo, home, detalle).
 *
 * El modelo de datos no tiene un campo `estado`: la no disponibilidad de una
 * unidad se modela con los flags visuales `flags.sold` y `flags.reserved`.
 */

/** Propiedades que no deben mostrarse en listados comerciales (home, catálogo). */
export interface PropertyAvailabilityFlags {
  sold?: boolean;
  reserved?: boolean;
}

/**
 * Una propiedad no está disponible cuando está vendida o reservada.
 */
export function isPropertyUnavailable(property: PropertyAvailabilityFlags): boolean {
  return Boolean(property?.sold) || Boolean(property?.reserved);
}

/**
 * Ordena las propiedades dejando las activas primero y las vendidas o
 * reservadas al final, preservando el orden original dentro de cada grupo.
 */
export function sortPropertiesByAvailability<T extends PropertyAvailabilityFlags>(
  properties: T[]
): T[] {
  return [...properties].sort((a, b) => {
    const aUnavailable = isPropertyUnavailable(a) ? 1 : 0;
    const bUnavailable = isPropertyUnavailable(b) ? 1 : 0;
    return aUnavailable - bUnavailable;
  });
}

/**
 * Construye una expresión regular tolerante para buscar un barrio dentro del
 * campo de texto libre `address.barrio`.
 *
 * - "210-viviendas" matchea "210 Viviendas", "210-viviendas", "210Viviendas".
 * - "stefenelli" matchea "Barrio Stefenelli", "Stefenelli Sur".
 */
export function buildBarrioMatchRegex(barrio: string): RegExp | null {
  const slug = (barrio ?? "").trim().toLowerCase();
  if (!slug) return null;

  const escaped = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("[\\s\\-_]*");

  if (!escaped) return null;

  return new RegExp(`(?:barrio\\s+)?${escaped}`, "i");
}

/**
 * Indica si el nombre de barrio de una propiedad corresponde al barrio buscado.
 * Se usa para replicar en el cliente el filtro por barrio aplicado en servidor.
 */
export function matchesBarrioQuery(
  barrioName: string | undefined,
  barrioQuery: string | undefined
): boolean {
  const query = (barrioQuery ?? "").trim();
  if (!query) return true;

  const name = (barrioName ?? "").trim();
  if (!name) return false;

  const regex = buildBarrioMatchRegex(query);
  if (!regex) return true;

  return regex.test(name);
}
