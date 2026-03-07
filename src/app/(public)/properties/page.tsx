/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

import PropertyCard from "@/components/shared/PropertyCard/PropertyCard";
import Filters from "@/components/shared/Filters/Filters";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";

type SearchParams = {
  page?: string;
  operationType?: string;
  propertyType?: string;
  zone?: string;
};

export const metadata: Metadata = {
  title: "Buscador de propiedades en General Roca",
  description:
    "Filtrá y buscá propiedades en venta y alquiler en General Roca, Río Negro, por tipo, operación y zona.",
  alternates: {
    canonical: getCanonicalUrl("/properties"),
  },
};

async function getProperties(searchParams: SearchParams) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const res = await fetch(
    `${process.env.BASE_URL}/api/properties?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch properties");

  return res.json();
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  const data = await getProperties(resolvedSearchParams);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Propiedades</h1>

      <Filters />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {data.items.map((property: any) => (
          <PropertyCard key={property.slug} property={property} />
        ))}
      </div>
    </div>
  );
}
