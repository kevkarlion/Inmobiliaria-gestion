/**
 * Títulos SEO estandarizados para tarjetas de propiedad.
 *
 * Patrón: `[Tipo de Inmueble] en Venta en [Barrio / Zona], [Localidad]`
 * Ej.: "Casa en Venta en 210 Viviendas, General Roca"
 */

export interface PropertySeoTitleInput {
  typeName?: string;
  barrioName?: string;
  zoneName?: string;
  cityName?: string;
  operationType?: "venta" | "alquiler";
}

const DEFAULT_TYPE_NAME = "Propiedad";

function operationLabel(operationType?: string): string {
  return operationType === "alquiler" ? "Alquiler" : "Venta";
}

/**
 * Compone el título SEO de una propiedad a partir de su tipo, zona y localidad.
 * Si no hay barrio, usa la localidad como único anclaje geográfico.
 */
export function buildPropertySeoTitle({
  typeName,
  barrioName,
  zoneName,
  cityName,
  operationType,
}: PropertySeoTitleInput): string {
  const type = (typeName ?? "").trim() || DEFAULT_TYPE_NAME;
  const op = operationLabel(operationType);

  const barrio = (barrioName ?? "").trim();
  const zone = (zoneName ?? "").trim();
  const city = (cityName ?? "").trim();

  // zoneName suele venir como "Ciudad, Barrio": preferimos el barrio explícito.
  const location = barrio || zone || city;

  if (!location) {
    return `${type} en ${op}`;
  }

  if (!city || location.toLowerCase() === city.toLowerCase()) {
    return `${type} en ${op} en ${location}`;
  }

  return `${type} en ${op} en ${location}, ${city}`;
}
