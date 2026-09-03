import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";
import SearchTypePage from "@/components/shared/SearchTypePage/SearchTypePage";
import RelatedCategories, {
  type PropertyQuery,
} from "@/components/shared/RelatedCategories/RelatedCategories";
import { JsonLd } from "@/lib/seo/jsonLd";
import { buildItemListSchema } from "@/lib/seo/schemas/itemList";
import { buildCollectionPageSchema } from "@/lib/seo/schemas/collectionPage";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumbList";
import { buildBreadcrumbItems } from "@/lib/seo/breadcrumbs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Propiedades en Venta en Río Negro",
  description:
    "Casas, departamentos, terrenos y loteos en venta en Río Negro. Contamos con propiedades en diversas localidades con asesoramiento profesional de Riquelme Propiedades.",
  alternates: { canonical: getCanonicalUrl("/venta-de-propiedades") },
  openGraph: {
    title: "Propiedades en Venta en Río Negro",
    description:
      "Encontrá tu próxima propiedad en Río Negro. Casas, departamentos, terrenos y loteos en venta.",
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

export default async function VentaPropiedadesPage() {
  const properties = await getUiProperties({
    operationType: "venta",
    limit: 50,
  });

  const canonicalUrl = getCanonicalUrl("/venta-de-propiedades");
  const itemListSchema = buildItemListSchema(properties);
  const collectionPageSchema = buildCollectionPageSchema(
    canonicalUrl,
    itemListSchema
  );
  const breadcrumbItems = buildBreadcrumbItems("/venta-de-propiedades", [
    "Inicio",
    "Venta de Propiedades",
  ]);
  const breadcrumbSchema = buildBreadcrumbListSchema(breadcrumbItems);

  return (
    <>
      <JsonLd type="ItemList" data={itemListSchema} />
      <JsonLd type="CollectionPage" data={collectionPageSchema} />
      <JsonLd type="BreadcrumbList" data={breadcrumbSchema} />

      <SearchTypePage
        properties={properties}
        filterParam="venta"
        seoTitle="Propiedades en Venta en Río Negro"
        seoDescription="Comprá casas, departamentos, terrenos y loteos en venta en Río Negro con la asesoría de Riquelme Propiedades en General Roca y la región."
      >
        <RelatedCategories categories={CATEGORY_LINKS} />
      </SearchTypePage>
    </>
  );
}
