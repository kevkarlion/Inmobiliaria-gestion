import { SEO_CONFIG } from "@/lib/seo/config";

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}${SEO_CONFIG.logo}`,
    description:
      "Inmobiliaria en General Roca, Río Negro. Venta y alquiler de propiedades.",
    address: {
      "@type": "PostalAddress",
      streetAddress: SEO_CONFIG.address.street,
      addressLocality: SEO_CONFIG.address.locality,
      addressRegion: SEO_CONFIG.address.region,
      addressCountry: SEO_CONFIG.address.country,
      postalCode: SEO_CONFIG.address.postalCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -39.0333,
      longitude: -67.5833,
    },
    telephone: SEO_CONFIG.phone,
    email: SEO_CONFIG.email,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: [
      {
        "@type": "City",
        name: "General Roca",
        containedInPlace: {
          "@type": "State",
          name: "Río Negro",
        },
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Propiedades en Venta y Alquiler",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Casas en venta en General Roca",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Departamentos en venta en General Roca",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Terrenos en venta en General Roca",
          },
        },
      ],
    },
    sameAs: [SEO_CONFIG.social.facebook, SEO_CONFIG.social.instagram],
  };
}
