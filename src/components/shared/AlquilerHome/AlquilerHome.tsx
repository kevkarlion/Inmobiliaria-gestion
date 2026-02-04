// components/home/SalesHome.tsx
import PropertyGrid from "@/components/shared/PropertyGrid/PropertyGrid";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import { PropertyUI } from "@/domain/types/PropertyUI.types";



async function getAlquiler() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/properties?operationType=alquiler&limit=6`,
    { cache: "no-store" } // o revalidate: 60
  );

  const data = await res.json();
  return data.items;
}

export default async function AlquilerHome() {
  const items = await getAlquiler();

  const properties: PropertyUI[] = items.map(mapPropertyToUI);

  return (
    <PropertyGrid
      title="En alquiler"
      subtitle="Propiedades con condiciones especiales..."
      properties={properties}
    />
  );
}
