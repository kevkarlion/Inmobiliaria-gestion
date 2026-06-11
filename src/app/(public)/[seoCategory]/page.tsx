import { notFound } from "next/navigation";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";

import { SEO_CATEGORIES, getSeoCategoryBySlug } from "@/lib/seoCategories";
import { parseSeoListingSlug } from "@/lib/seoUrls";
import { getCanonicalUrl } from "@/lib/config";
import { pluralizePropertyType } from "@/lib/propertyTypeLabels";

import { getUiProperties } from "@/components/server/data-access/get-ui-properties";
import { PropertyService } from "@/server/services/property.service";

import SearchTypePage from "@/components/shared/SearchTypePage/SearchTypePage";

import { JsonLd } from "@/lib/seo/jsonLd";
import { buildItemListSchema } from "@/lib/seo/schemas/itemList";
import { buildCollectionPageSchema } from "@/lib/seo/schemas/collectionPage";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumbList";
import { buildBreadcrumbItems } from "@/lib/seo/breadcrumbs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = Promise<{ seoCategory: string }>;
type Props = { params: Params };

export async function generateStaticParams() {
  return SEO_CATEGORIES.map((category) => ({
    seoCategory: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seoCategory } = await params;

  const category = getSeoCategoryBySlug(seoCategory);

  if (category) {
    return {
      title: category.title,
      description: category.description,
      alternates: { canonical: category.canonical },
      openGraph: {
        title: category.title,
        description: category.description,
        url: category.canonical,
        siteName: "Riquelme Propiedades",
        locale: "es_AR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: category.title,
        description: category.description,
      },
    };
  }

  const parsed = parseSeoListingSlug(seoCategory);
  if (!parsed) return {};

  const names = await PropertyService.getSeoListingNames(
    parsed.typeSlug,
    parsed.citySlug
  );

  if (!names) return {};

  const opLabel = parsed.operation === "venta" ? "venta" : "alquiler";

  const typePlural = pluralizePropertyType(names.typeName);

  const title = `${typePlural} en ${opLabel} en ${names.cityName} | Riquelme Propiedades`;

  const description = `${typePlural} en ${opLabel} en ${names.cityName}. Encontrá opciones inmobiliarias con Riquelme Propiedades.`;

  const canonical = getCanonicalUrl(`/${seoCategory}`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Riquelme Propiedades",
      locale: "es_AR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function buildSeoSchemas(properties: { slug: string; title: string }[], canonicalUrl: string, breadcrumbLabels: string[], path: string) {
  const itemListSchema = buildItemListSchema(properties);
  const collectionPageSchema = buildCollectionPageSchema(canonicalUrl, itemListSchema);
  const breadcrumbItems = buildBreadcrumbItems(path, breadcrumbLabels);
  const breadcrumbSchema = buildBreadcrumbListSchema(breadcrumbItems);

  return { itemListSchema, collectionPageSchema, breadcrumbSchema };
}

export default async function SeoCategoryPage({ params }: Props) {
  const { seoCategory } = await params;

  const category = getSeoCategoryBySlug(seoCategory);

  if (category) {
    const properties = await getUiProperties({
      operationType: category.operationType,
      propertyType: category.propertyTypeSlug,
      city: category.citySlug,
      limit: 50,
    });

    const canonicalUrl = category.canonical;
    const breadcrumbLabels = ["Inicio", category.title];
    const schemas = buildSeoSchemas(properties, canonicalUrl, breadcrumbLabels, `/${seoCategory}`);

    return (
      <>
        <JsonLd type="ItemList" data={schemas.itemListSchema} />
        <JsonLd type="CollectionPage" data={schemas.collectionPageSchema} />
        <JsonLd type="BreadcrumbList" data={schemas.breadcrumbSchema} />
        <SearchTypePage
          properties={properties}
          filterParam={seoCategory}
          fixedCity={category.citySlug}
          fixedPropertyType={category.propertyTypeSlug}
          fixedOperation={category.operationType}
          seoTitle={category.title}
          seoDescription={category.description}
        />
      </>
    );
  }

  const parsed = parseSeoListingSlug(seoCategory);

  if (!parsed) notFound();

  const names = await PropertyService.getSeoListingNames(
    parsed.typeSlug,
    parsed.citySlug
  );

  if (!names) notFound();

  const properties = await getUiProperties({
    operationType: parsed.operation,
    propertyType: parsed.typeSlug,
    city: parsed.citySlug,
    limit: 50,
  });

  const opLabel = parsed.operation === "venta" ? "venta" : "alquiler";

  const typePlural = pluralizePropertyType(names.typeName);

  const seoTitle = `${typePlural} en ${opLabel} en ${names.cityName}`;

  const seoDescription = `${typePlural} en ${opLabel} en ${names.cityName}. Encontrá opciones con Riquelme Propiedades.`;

  const canonicalUrl = getCanonicalUrl(`/${seoCategory}`);
  const breadcrumbLabels = ["Inicio", seoTitle];
  const schemas = buildSeoSchemas(properties, canonicalUrl, breadcrumbLabels, `/${seoCategory}`);

  return (
    <>
      <JsonLd type="ItemList" data={schemas.itemListSchema} />
      <JsonLd type="CollectionPage" data={schemas.collectionPageSchema} />
      <JsonLd type="BreadcrumbList" data={schemas.breadcrumbSchema} />
      <SearchTypePage
        properties={properties}
        filterParam={seoCategory}
        fixedCity={parsed.citySlug}
        fixedPropertyType={parsed.typeSlug}
        fixedOperation={parsed.operation}
        seoTitle={seoTitle}
        seoDescription={seoDescription}
      />
    </>
  );
}