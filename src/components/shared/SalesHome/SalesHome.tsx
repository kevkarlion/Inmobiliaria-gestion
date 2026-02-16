// components/home/SalesHome.tsx
export const revalidate = 120;
import PropertyGrid from "@/components/shared/PropertyGrid/PropertyGrid";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";

export default async function SalesHome() {
  const properties = await getUiProperties({ 
    type: "venta", 
    limit: 6 
  });

   if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <PropertyGrid
      title="En venta"
      subtitle="Contamos con una amplia cartera de inmuebles seleccionados bajo estrictos estándares de calidad. Te acompañamos en todo el proceso de compra, brindándote el asesoramiento técnico y legal necesario para que tu inversión sea segura y tu nuevo hogar, exactamente lo que soñaste."
      properties={properties}
      filter="venta"
    />
  );
}
