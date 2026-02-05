// components/home/SalesHome.tsx
import PropertyGrid from "@/components/shared/PropertyGrid/PropertyGrid";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import { PropertyUI } from "@/domain/types/PropertyUI.types";



async function getSales() {
  const res = await fetch(
    `${process.env.BASE_URL}/api/properties?operationType=venta&limit=6`,
    { cache: "no-store" } // o revalidate: 60
  );

  const data = await res.json();
  return data.items;
}

export default async function SalesHome() {
  const items = await getSales();

  const properties: PropertyUI[] = items.map(mapPropertyToUI);

  return (
    <PropertyGrid
      title="En venta"
      subtitle="Propiedades con condiciones especiales..."
      properties={properties}
      filter="venta"
    />
  );
}
