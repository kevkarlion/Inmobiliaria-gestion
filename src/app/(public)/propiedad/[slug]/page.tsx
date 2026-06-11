// app/(main)/propiedad/[slug]/page.tsx
import { PropertyDetailClient } from "@/components/shared/PropertyDetailClient/PropertyDetailClient";
import { notFound } from "next/navigation";
import { PropertyService } from "@/server/services/property.service";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";
import { buildOgImageUrl } from "@/lib/ogImage";
import { JsonLd } from "@/lib/seo/jsonLd";
import { buildRealEstateListingSchema } from "@/lib/seo/schemas/realEstateListing";
import { buildBreadcrumbListSchema } from "@/lib/seo/schemas/breadcrumbList";
import { buildBreadcrumbItems } from "@/lib/seo/breadcrumbs";
import { generateAltText } from "@/lib/seo/image";

// ⚡ IMPORTANTE: metadata dinámica por slug (clave para compartir)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const property = await PropertyService.findBySlug(slug);

  if (!property) {
    return {
      title: "Propiedad no encontrada",
      description: "Esta propiedad no existe o fue eliminada.",
    };
  }

  const operation =
    property.operationType === "venta"
      ? "en venta"
      : property.operationType === "alquiler"
      ? "en alquiler"
      : "";

  const locationParts = [
    property.barrioName,
    property.zoneName,
    property.cityName || "General Roca",
    property.provinceName || "Río Negro",
  ].filter(Boolean);

  const titleLocation = locationParts.slice(0, 2).join(", ");

  const title = `${property.title} ${
    operation ? `- ${operation}` : ""
  }${titleLocation ? ` en ${titleLocation}` : ""}`;

  const baseDescription =
    property.description?.slice(0, 140) ||
    `Propiedad ${operation || ""} en ${locationParts
      .filter(Boolean)
      .join(", ")}.`;

  const description = `${baseDescription} Consultanos en Riquelme Propiedades, inmobiliaria en General Roca, Río Negro.`;

  const rawImages: { url?: string }[] | string[] = property.images || [];
  const imageUrls: string[] = rawImages
    .slice(0, 6)
    .map((img: { url?: string } | string) => {
      const url = typeof img === "string" ? img : img?.url;
      return url ? buildOgImageUrl(url) : null;
    })
    .filter((u): u is string => Boolean(u));

  const ogImages = imageUrls.length > 0
    ? imageUrls.map((url) => ({
        url: url!,
        width: 1200,
        height: 630,
      }))
    : [];

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/propiedad/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: `/propiedad/${slug}`,
      siteName: "Riquelme Propiedades",
      locale: "es_AR",
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrls.length > 0 ? imageUrls : [],
    },
  };
}


export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const property = await PropertyService.findBySlug(slug);

  if (!property) notFound();

  const barrioName =
    property.address?.barrio?.name || property.barrioName || "";

  const breadcrumbLabels = ["Inicio", "Propiedades"];
  if (barrioName) breadcrumbLabels.push(barrioName);
  breadcrumbLabels.push(property.title);

  const breadcrumbItems = buildBreadcrumbItems(
    `/propiedad/${slug}`,
    breadcrumbLabels
  );

  const listingSchema = buildRealEstateListingSchema({
    title: property.title,
    slug: property.slug,
    description: property.description,
    images: ((property.images || []) as { url?: string }[] | string[]).map((img) => {
      const url = typeof img === "string" ? img : (img?.url || "");
      return { url };
    }),
    imagesDesktop: property.imagesDesktop,
    price: {
      amount: property.price?.amount || 0,
      currency: property.price?.currency || "USD",
    },
    address: {
      street: property.address?.street || "",
      number: property.address?.number || "",
      city: property.address?.city || null,
      province: property.address?.province || null,
    },
    location: {
      lat: property.location?.lat || 0,
      lng: property.location?.lng || 0,
    },
    features: {
      totalM2: property.features?.totalM2 || 0,
      bedrooms: property.features?.bedrooms || 0,
      bathrooms: property.features?.bathrooms || 0,
    },
    createdAt: property.createdAt,
  });

  const breadcrumbSchema = buildBreadcrumbListSchema(breadcrumbItems);

  const rawImages: { url?: string }[] | string[] = property.images || [];
  const imageCount = rawImages.length;
  const altTexts = Array.from({ length: imageCount }, (_, i) =>
    generateAltText({
      title: property.title,
      operationType: property.operationType,
      barrioName: property.barrioName,
      cityName: property.cityName,
    }, i)
  );

  const serialized = JSON.parse(JSON.stringify(property));

  return (
    <>
      <JsonLd type="RealEstateListing" data={listingSchema} />
      <JsonLd type="BreadcrumbList" data={breadcrumbSchema} />
      <PropertyDetailClient property={serialized} altTexts={altTexts} />
    </>
  );
}
