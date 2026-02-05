// components/home/OportunityHome.tsx
import PropertyGrid from "@/components/shared/PropertyGrid/PropertyGrid";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import { PropertyUI } from "@/domain/types/PropertyUI.types";

async function getOpportunities() {
  const res = await fetch(
    `${process.env.BASE_URL}/api/properties?opportunity=true&limit=6`,
    { cache: "no-store" } // o revalidate: 60
  );

  const data = await res.json();
  return data.items;
}

export default async function OportunityHome() {
  const items = await getOpportunities();

  const properties: PropertyUI[] = items.map(mapPropertyToUI);

  return (
    <PropertyGrid
      title="Oportunidades"
      subtitle="Propiedades con condiciones especiales..."
      properties={properties}
    />
  );
}
