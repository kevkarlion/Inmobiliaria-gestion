// app/(main)/propiedad/[slug]/page.tsx
import { PropertyDetailClient } from "@/components/shared/PropertyDetailClient/PropertyDetailClient";
import { notFound } from "next/navigation";
import { PropertyService } from "@/server/services/property.service";

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
