// components/home/SalesHome.tsx
import PropertyGrid from "@/components/shared/PropertyGrid/PropertyGrid";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import { PropertyUI } from "@/domain/types/PropertyUI.types";



async function getAlquiler() {
  const res = await fetch(
    `${process.env.BASE_URL}/api/properties?operationType=alquiler&limit=6`,
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
      subtitle="Encontrá el lugar ideal para vivir o trabajar. Ofrecemos una gestión de alquileres ágil y transparente, conectando a propietarios e inquilinos con seriedad y confianza. Revisamos cada propiedad para garantizar que tu próxima mudanza sea una experiencia sin complicaciones."
      properties={properties}
      filter="alquiler"
    />
  );
}
