import slugify from "slugify";

/**
 * Genera un slug SEO para la URL de detalle de propiedad.
 * Formato: {titulo-slugificado}-{ciudad}
 * Ej: loteos-tronelli-general-roca
 */
export function buildPropertySeoSlug(
  typeSlug: string,
  title: string,
  citySlug: string
): string {
  const middle = slugify(title, { lower: true, strict: true });
  if (!middle) return `${citySlug}`;
  return `${middle}-${citySlug}`;
}
