export const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// Dominio canónico del sitio para SEO.
// Permite override por entorno, pero por defecto usa el .com.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://riquelmeprop.com";

export const getCanonicalUrl = (path: string = "/") =>
  new URL(path, SITE_URL).toString();
