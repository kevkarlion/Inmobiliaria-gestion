// components/home/AlquilerHome.tsx
export const revalidate = 120;
import PropertyGrid from "@/components/shared/PropertyGrid/PropertyGrid";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";

export default async function AlquilerHome() {
  const properties = await getUiProperties({
    type: "alquiler",
    limit: 6,
  });

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <PropertyGrid
      title="En alquiler"
      subtitle="Encontrá el lugar ideal para vivir o trabajar. Ofrecemos una gestión de alquileres ágil y transparente, conectando a propietarios e inquilinos con seriedad y confianza. Revisamos cada propiedad para garantizar que tu próxima mudanza sea una experiencia sin complicaciones."
      properties={properties}
      filter="alquiler"
    />
  );
}
