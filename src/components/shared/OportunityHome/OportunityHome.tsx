// components/home/OportunityHome.tsx
export const revalidate = 120;
import PropertyGrid from "@/components/shared/PropertyGrid/PropertyGrid";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";

export default async function OportunityHome() {
  const properties = await getUiProperties({ 
    isOpportunity: true, 
    limit: 6 
  });

  return (
    <PropertyGrid
      title="Oportunidades"
      subtitle="Oportunidades de Inversión Selección exclusiva de propiedades con condiciones únicas de mercado. Ya sea por su valor competitivo, ubicación estratégica o potencial de revalorización, estas unidades representan una ventaja real para quienes buscan capitalizar su inversión con beneficios inmediatos."
      properties={properties}
      filter="oportunidad"
    />
  );
}
