// components/server/PropertyFetcher.tsx
import { PropertyService } from "@/server/services/property.service";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import SearchTypePage from "../shared/SearchTypePage/SearchTypePage";

export default async function PropertyFetcher({ type }: { type: string }) {
  // LLAMADA DIRECTA AL SERVICIO
  const data = await PropertyService.findByType(type);
  
  const properties = data.items.map(mapPropertyToUI);

  return <SearchTypePage properties={properties} filterParam={type} />;
}