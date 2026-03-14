import { getCanonicalUrl } from "@/lib/config";

type OperationType = "venta" | "alquiler";

interface SeoCategoryConfig {
  slug: string;
  title: string;
  description: string;
  operationType?: OperationType;
  propertyTypeSlug?: string;
  citySlug?: string;
  canonical: string;
}

// Por ahora nos enfocamos en General Roca.
const CITY_SLUG_GENERAL_ROCA = "general-roca";

export const SEO_CATEGORIES: SeoCategoryConfig[] = [
  {
    slug: "casas-en-venta-general-roca",
    title: "Casas en venta en General Roca",
    description:
      "Casas en venta en General Roca, Río Negro. Propiedades seleccionadas por Riquelme Propiedades para uso familiar y profesional.",
    operationType: "venta",
    propertyTypeSlug: "casa",
    citySlug: CITY_SLUG_GENERAL_ROCA,
    canonical: getCanonicalUrl("/casas-en-venta-general-roca"),
  },
  {
    slug: "departamentos-en-venta-general-roca",
    title: "Departamentos en venta en General Roca",
    description:
      "Departamentos en venta en General Roca, Río Negro. Departamentos modernos y proyectos en pozo con entrega inmediata.",
    operationType: "venta",
    propertyTypeSlug: "departamento",
    citySlug: CITY_SLUG_GENERAL_ROCA,
    canonical: getCanonicalUrl("/departamentos-en-venta-general-roca"),
  },
  {
    slug: "terrenos-en-venta-general-roca",
    title: "Terrenos en venta en General Roca",
    description:
      "Terrenos y lotes en venta en General Roca, Río Negro. Opciones para desarrollo residencial y proyectos de inversión.",
    operationType: "venta",
    propertyTypeSlug: "terreno",
    citySlug: CITY_SLUG_GENERAL_ROCA,
    canonical: getCanonicalUrl("/terrenos-en-venta-general-roca"),
  },
  {
    slug: "loteos-en-venta-general-roca",
    title: "Loteos en venta en General Roca",
    description:
      "Loteos en venta en General Roca, Río Negro. Proyectos urbanísticos y lotes en cuotas con asesoramiento profesional.",
    operationType: "venta",
    propertyTypeSlug: "loteo",
    citySlug: CITY_SLUG_GENERAL_ROCA,
    canonical: getCanonicalUrl("/loteos-en-venta-general-roca"),
  },
  {
    slug: "departamentos-en-pozo-en-venta-general-roca",
    title: "Departamentos en Pozo en venta en General Roca",
    description:
      "Departamentos en pozo en venta en General Roca, Río Negro. Proyectos en construcción con financiación y entrega diferida.",
    operationType: "venta",
    propertyTypeSlug: "departamento-en-pozo",
    citySlug: CITY_SLUG_GENERAL_ROCA,
    canonical: getCanonicalUrl("/departamentos-en-pozo-en-venta-general-roca"),
  },
];

export const getSeoCategoryBySlug = (slug: string) =>
  SEO_CATEGORIES.find((c) => c.slug === slug);

