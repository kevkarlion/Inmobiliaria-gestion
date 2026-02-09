// app/propiedades/[filter]/page.tsx
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";
import SearchTypePage from "@/components/shared/SearchTypePage/SearchTypePage";

interface Props {
  params: Promise<{ filter: string }>;
}

export default async function Page({ params }: Props) {
  // 1. Resolvemos el parámetro de la URL (Next.js 15+)
  const { filter } = await params;

  // 2. Mapeamos el 'filter' a lo que espera tu lógica de negocio
  // Si el filtro es "oportunidad", mandamos el flag isOpportunity
  const isOpportunity = filter === "oportunidad";
  console.log('filter',filter)
  
  // Si no es oportunidad, asumimos que es un operationType (venta/alquiler)
  // Si es oportunidad, el operationType lo mandamos undefined para que traiga todas
  const operationType = isOpportunity ? undefined : filter;

  // 3. Llamada directa a la función del servidor (sin intermediarios)
  const properties = await getUiProperties({
    type: operationType,
    isOpportunity: isOpportunity,
    limit: 50, // O el límite que prefieras para la búsqueda
  });

  // 4. Renderizamos directamente el componente de cliente
  return (
    <SearchTypePage 
      properties={properties} 
      filterParam={filter} 
    />
  );
}