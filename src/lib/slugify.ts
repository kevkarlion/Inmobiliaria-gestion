/**
 * Convierte un texto a un slug URL-friendly.
 * - Lowercase
 * - Reemplaza espacios y caracteres especiales con guiones
 * - Remueve acentos
 * - Elimina caracteres no alfanuméricos (excepto guiones)
 */
export function slugify(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
