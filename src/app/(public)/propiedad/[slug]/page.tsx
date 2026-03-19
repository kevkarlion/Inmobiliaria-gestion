// app/(main)/propiedad/[slug]/page.tsx
import { PropertyDetailClient } from "@/components/shared/PropertyDetailClient/PropertyDetailClient";
import { notFound } from "next/navigation";
import { PropertyService } from "@/server/services/property.service";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";
import { buildOgImageUrl } from "@/lib/ogImage";

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

  // Handle both string and object formats for images
  const rawImage = property.images?.[0];
  const imageUrl = typeof rawImage === "string" 
    ? rawImage 
    : (rawImage as { url?: string })?.url || null;
  const optimizedImage = buildOgImageUrl(imageUrl);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/propiedad/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: `/propiedad/${slug}`, // ahora relativa (mejor práctica)
      type: "website",
      images: optimizedImage
        ? [
            {
              url: optimizedImage,
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
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

  return <PropertyDetailClient property={property} />;
}
