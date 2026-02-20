
// app/(main)/propiedades/[slug]/page.tsx
import { PropertyDetailClient } from "@/components/shared/PropertyDetailClient/PropertyDetailClient";
import { notFound } from "next/navigation";


// app/(main)/propiedades/[slug]/page.tsx
export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.BASE_URL}/api/properties/${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) notFound();
  const property = await res.json();
  console.log('property', property)
  if (!property) notFound();
  return <PropertyDetailClient property={property} />;
}



