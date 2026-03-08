import { notFound } from "next/navigation";
import { Metadata } from "next";

import { SEO_CATEGORIES, getSeoCategoryBySlug } from "@/lib/seoCategories";
import { parseSeoListingSlug } from "@/lib/seoUrls";
import { getCanonicalUrl } from "@/lib/config";
import { pluralizePropertyType } from "@/lib/propertyTypeLabels";

import { getUiProperties } from "@/components/server/data-access/get-ui-properties";
import { PropertyService } from "@/server/services/property.service";

import SearchTypePage from "@/components/shared/SearchTypePage/SearchTypePage";

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
        type: "website",
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
      type: "website",
    },
  };
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

    return (
      <SearchTypePage
        properties={properties}
        filterParam={seoCategory}
        fixedCity={category.citySlug}
        fixedPropertyType={category.propertyTypeSlug}
        fixedOperation={category.operationType}
        seoTitle={category.title}
        seoDescription={category.description}
      />
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

  return (
    <SearchTypePage
      properties={properties}
      filterParam={seoCategory}
      fixedCity={parsed.citySlug}
      fixedPropertyType={parsed.typeSlug}
      fixedOperation={parsed.operation}
      seoTitle={seoTitle}
      seoDescription={seoDescription}
    />
  );
}