/* eslint-disable @typescript-eslint/no-explicit-any */
import PropertyFetcher from "@/components/server/PropertyFetcher";

export default async function Page({
  params,
}: {
  params: Promise<{ filter: string }>; // Cambiado de 'type' a 'filter'
}) {
  // 1. Esperamos a que la promesa de params se resuelva
  const { filter } = await params;

  // 2. Ahora 'filter' tendrá el valor (ej: 'oportunidad')
  console.log("Valor del parámetro [filter]:", filter);

  // 3. Se lo pasas a PropertyFetcher.
  // Si PropertyFetcher espera un prop llamado "type", esto es correcto:
  return <PropertyFetcher type={filter as any} />;
}
