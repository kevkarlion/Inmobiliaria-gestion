/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

import PropertyCard from "@/components/shared/PropertyCard/PropertyCard";
import Filters from "@/components/shared/Filters/Filters";

type SearchParams = {
  page?: string;
  operationType?: string;
  propertyType?: string;
  zone?: string;
};

async function getProperties(searchParams: SearchParams) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/properties?${params.toString()}`,
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
  // ✅ ESTO ES OBLIGATORIO EN NEXT 15/16
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
