// app/(main)/propiedad/[slug]/page.tsx
import { PropertyDetailClient } from "@/components/shared/PropertyDetailClient/PropertyDetailClient";
import { notFound } from "next/navigation";
import { PropertyService } from "@/server/services/property.service";
import type { Metadata } from "next";

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

  const title = property.title;
  const description =
    property.description?.slice(0, 160) ||
    `Propiedad en ${property.zoneName}`;

  const image = property.images?.[0];

  return {
    metadataBase: new URL("https://riquelmeprop.com"), // 🔥 CLAVE
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/propiedad/${slug}`, // ahora relativa (mejor práctica)
      type: "website",
      images: image
        ? [
            {
              url: image,
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
      images: image ? [image] : [],
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
  console.log('property', property)

  if (!property) notFound();

  return <PropertyDetailClient property={property} />;
}
