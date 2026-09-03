import { getCanonicalUrl } from "@/lib/config";

type OperationType = "venta" | "alquiler";

interface SeoCategoryConfig {
  slug: string;
  title: string;
  description: string;
  operationType?: OperationType;
  propertyTypeSlug?: string;
  citySlug?: string;
  provinceSlug?: string;
  canonical: string;
}

// Ciudades
const CITY_SLUG_GENERAL_ROCA = "general-roca";

// Provincias
const PROVINCE_SLUG_RIO_NEGRO = "rio-negro";
const PROVINCE_SLUG_NEUQUEN = "neuquen";

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
  // Variante para keyword "venta de loteo"
  {
    slug: "venta-de-loteo-general-roca",
    title: "Venta de Loteo en General Roca",
    description:
      "Venta de loteo en General Roca, Río Negro. Lotes en cuotas con infraestructura y servicios en barrios planificados.",
    operationType: "venta",
    propertyTypeSlug: "loteo",
    citySlug: CITY_SLUG_GENERAL_ROCA,
    canonical: getCanonicalUrl("/venta-de-loteo-general-roca"),
  },
  // === Páginas provinciales Río Negro ===
  {
    slug: "casas-en-venta-rio-negro",
    title: "Casas en venta en Río Negro",
    description:
      "Casas en venta en Río Negro. Propiedades en General Roca, Cipolletti, Viedma y otras ciudades de la provincia.",
    operationType: "venta",
    propertyTypeSlug: "casa",
    provinceSlug: PROVINCE_SLUG_RIO_NEGRO,
    canonical: getCanonicalUrl("/casas-en-venta-rio-negro"),
  },
  {
    slug: "departamentos-en-venta-rio-negro",
    title: "Departamentos en venta en Río Negro",
    description:
      "Departamentos en venta en Río Negro. Opciones en General Roca, Cipolletti y Neuquén con la mejor asesoría.",
    operationType: "venta",
    propertyTypeSlug: "departamento",
    provinceSlug: PROVINCE_SLUG_RIO_NEGRO,
    canonical: getCanonicalUrl("/departamentos-en-venta-rio-negro"),
  },
  {
    slug: "terrenos-en-venta-rio-negro",
    title: "Terrenos en venta en Río Negro",
    description:
      "Terrenos y lotes en venta en Río Negro. Invertí en terreno en General Roca, Cipolletti o zonas aledañas.",
    operationType: "venta",
    propertyTypeSlug: "terreno",
    provinceSlug: PROVINCE_SLUG_RIO_NEGRO,
    canonical: getCanonicalUrl("/terrenos-en-venta-rio-negro"),
  },
  // === Páginas Neuquén ===
  {
    slug: "casas-en-venta-neuquen",
    title: "Casas en venta en Neuquén",
    description:
      "Casas en venta en Neuquén Capital y alrededores. Propiedades residenciales con asesoramiento de Riquelme Propiedades.",
    operationType: "venta",
    propertyTypeSlug: "casa",
    provinceSlug: PROVINCE_SLUG_NEUQUEN,
    canonical: getCanonicalUrl("/casas-en-venta-neuquen"),
  },
  {
    slug: "departamentos-en-venta-neuquen",
    title: "Departamentos en venta en Neuquén",
    description:
      "Departamentos en venta en Neuquén. Opciones modernas y proyectos en pozo con financiación.",
    operationType: "venta",
    propertyTypeSlug: "departamento",
    provinceSlug: PROVINCE_SLUG_NEUQUEN,
    canonical: getCanonicalUrl("/departamentos-en-venta-neuquen"),
  },
  {
    slug: "terrenos-en-venta-neuquen",
    title: "Terrenos en venta en Neuquén",
    description:
      "Terrenos en venta en Neuquén. Lotes para desarrollo residencial e inversión en la capital provincial.",
    operationType: "venta",
    propertyTypeSlug: "terreno",
    provinceSlug: PROVINCE_SLUG_NEUQUEN,
    canonical: getCanonicalUrl("/terrenos-en-venta-neuquen"),
  },
];

export const getSeoCategoryBySlug = (slug: string) =>
  SEO_CATEGORIES.find((c) => c.slug === slug);

