import { SEO_CONFIG } from "@/lib/seo/config";

/**
 * Entidad comercial local (`RealEstateAgent`) para la Home.
 *
 * Nota de coherencia con el sitio:
 * - El dominio canónico configurado en `SITE_URL` es sin `www` (la política de
 *   redirects del proyecto manda `www` -> dominio canónico), por eso las URLs
 *   absolutas se derivan de `SEO_CONFIG.siteUrl`.
 * - `sameAs` apunta a los perfiles reales de la inmobiliaria en lugar de las
 *   URLs vacías genéricas.
 */
export function buildRealEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SEO_CONFIG.siteName,
    image: `${SEO_CONFIG.siteUrl}/logo-desktop-2026.png`,
    "@id": `${SEO_CONFIG.siteUrl}/#organization`,
    url: SEO_CONFIG.siteUrl,
    telephone: SEO_CONFIG.phone,
    email: SEO_CONFIG.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "General Roca",
      addressRegion: "Río Negro",
      addressCountry: "AR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-39.0298",
      longitude: "-67.5792",
    },
    areaServed: [
      "General Roca",
      "Alto Valle",
      "Las Grutas",
      "San Carlos de Bariloche",
      "Sierra Grande",
    ],
    sameAs: [SEO_CONFIG.social.instagram, SEO_CONFIG.social.facebook],
  };
}
