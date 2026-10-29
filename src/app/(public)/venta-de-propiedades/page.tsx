import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";
import SearchTypePage from "@/components/shared/SearchTypePage/SearchTypePage";
import RelatedCategories, {
  type PropertyQuery,
} from "@/components/shared/RelatedCategories/RelatedCategories";
import { JsonLd } from "@/lib/seo/jsonLd";
import { buildCatalogItemListSchema } from "@/lib/seo/schemas/itemList";
import { buildCollectionPageSchema } from "@/lib/seo/schemas/collectionPage";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumbList";
import { buildBreadcrumbItems } from "@/lib/seo/breadcrumbs";
import { buildPropertySeoTitle } from "@/lib/seo/propertyTitle";
import { sortPropertiesByAvailability } from "@/lib/propertyFilters";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_TITLE = "Propiedades en Venta en General Roca y Alto Valle";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    "Casas, departamentos, terrenos y loteos en venta en General Roca, Río Negro y el Alto Valle. Comprá con la asesoría de Riquelme Propiedades.",
  alternates: { canonical: getCanonicalUrl("/venta-de-propiedades") },
  openGraph: {
    title: PAGE_TITLE,
    description:
      "Encontrá tu próxima propiedad en General Roca y el Alto Valle. Casas, departamentos, terrenos y loteos en venta.",
    url: getCanonicalUrl("/venta-de-propiedades"),
    siteName: "Riquelme Propiedades",
    locale: "es_AR",
    type: "website",
  },
};

const CATEGORY_LINKS: {
  title: string;
  href: string;
  query: PropertyQuery;
}[] = [
  {
    title: "Casas en venta en Río Negro",
    href: "/casas-en-venta-rio-negro",
    query: { operationType: "venta", propertyType: "casa", province: "rio-negro" },
  },
  {
    title: "Departamentos en venta en Río Negro",
    href: "/departamentos-en-venta-rio-negro",
    query: { operationType: "venta", propertyType: "departamento", province: "rio-negro" },
  },
  {
    title: "Terrenos en venta en Río Negro",
    href: "/terrenos-en-venta-rio-negro",
    query: { operationType: "venta", propertyType: "terreno", province: "rio-negro" },
  },
  {
    title: "Loteos en venta en General Roca",
    href: "/loteos-en-venta-general-roca",
    query: { operationType: "venta", propertyType: "loteo", city: "general-roca" },
  },
];

interface Props {
  searchParams: Promise<{
    tipo?: string;
    barrio?: string;
    ubicacion?: string;
  }>;
}

export default async function VentaPropiedadesPage({ searchParams }: Props) {
  const { tipo, barrio, ubicacion } = await searchParams;

  const properties = await getUiProperties({
    operationType: "venta",
    propertyType: tipo,
    city: ubicacion,
    barrio,
    limit: 50,
  });

  // Las unidades activas van primero; vendidas y reservadas se desplazan al final.
  const sortedProperties = sortPropertiesByAvailability(properties);

  const itemListSchema = buildCatalogItemListSchema(
    sortedProperties.map((p) => ({
      slug: p.slug,
      title: buildPropertySeoTitle({
        typeName: p.typeName,
        barrioName: p.barrioName,
        cityName: p.cityName,
        operationType: p.operationType,
      }),
    }))
  );

  const breadcrumbItems = buildBreadcrumbItems("/venta-de-propiedades", [
    "Inicio",
    "Venta de Propiedades",
  ]);
  const breadcrumbSchema = buildBreadcrumbListSchema(breadcrumbItems);

  const collectionSchema = buildCollectionPageSchema(
    getCanonicalUrl("/venta-de-propiedades"),
    itemListSchema
  );

  return (
    <>
      <JsonLd type="ItemList" data={itemListSchema} />
      <JsonLd type="CollectionPage" data={collectionSchema} />
      <JsonLd type="BreadcrumbList" data={breadcrumbSchema} />

      <SearchTypePage
        properties={sortedProperties}
        filterParam="venta"
        fixedCity={ubicacion}
        fixedPropertyType={tipo}
        fixedOperation="venta"
        barrioQuery={barrio}
        showQuickFilters
        quickFilterType={tipo}
        quickFilterCity={ubicacion}
        seoTitle={PAGE_TITLE}
        seoDescription="Comprá casas, departamentos, terrenos y loteos en venta en General Roca y el Alto Valle con la asesoría de Riquelme Propiedades."
      >
        <RelatedCategories categories={CATEGORY_LINKS} />
      </SearchTypePage>
    </>
  );
}
