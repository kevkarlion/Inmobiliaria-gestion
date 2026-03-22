export interface BlogCategoryMeta {
  slug: string;
  label: string;
  description: string;
  keywords: string[];
}

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  {
    slug: "mercado-inmobiliario",
    label: "Mercado Inmobiliario",
    description:
      "Análisis del mercado inmobiliario local: precios, tendencias, oferta y demanda en la zona.",
    keywords: [
      "mercado inmobiliario",
      "precios propiedades",
      "tendencias inmobiliarias",
      "oferta y demanda",
    ],
  },
  {
    slug: "inversiones",
    label: "Inversiones",
    description:
      "Oportunidades de inversión inmobiliaria, rentabilidad y estrategias para maximizar tu capital.",
    keywords: [
      "inversión inmobiliaria",
      "rentabilidad",
      "invertir en propiedades",
      "alquileres",
    ],
  },
  {
    slug: "guias",
    label: "Guías",
    description:
      "Guías prácticas para compradores, vendedores e inquilinos. Todo lo que necesitás saber.",
    keywords: [
      "guía inmobiliaria",
      "comprar propiedad",
      "vender propiedad",
      "trámites inmobiliarios",
    ],
  },
  {
    slug: "normativa",
    label: "Normativa",
    description:
      "Actualizaciones legales, regulaciones y cambios normativos que afectan al sector inmobiliario.",
    keywords: [
      "normativa inmobiliaria",
      "ley de alquileres",
      "impuestos propiedades",
      "regulaciones",
    ],
  },
  {
    slug: "comunidad",
    label: "Comunidad",
    description:
      "Novedades sobre el barrio, desarrollo urbano, obras públicas y vida en la zona.",
    keywords: [
      "comunidad",
      "barrio",
      "desarrollo urbano",
      "obras públicas",
    ],
  },
];

export function getCategoryMeta(slug: string): BlogCategoryMeta | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryLabel(slug: string): string {
  return getCategoryMeta(slug)?.label || slug;
}
