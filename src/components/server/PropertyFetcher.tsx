// components/server/PropertyFetcher.tsx
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import SearchTypePage from "../shared/SearchTypePage/SearchTypePage";

async function getProperties(filter: string) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/properties`;

  if (filter === "venta" || filter === "alquiler") {
    url += `?operationType=${filter}`;
  }

  if (filter === "oportunidad") {
    url += `?opportunity=true`;
  }

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Error fetching properties");
  return res.json();
}



export default async function PropertyFetcher({ type }: { type: string }) {
  const data = await getProperties(type);
  const properties = data.items.map(mapPropertyToUI);

  // Enviamos `filterParam` desde el servidor
  return <SearchTypePage properties={properties} filterParam={type} />;
}
