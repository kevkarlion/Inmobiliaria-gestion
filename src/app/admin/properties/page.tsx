// app/admin/properties/page.tsx (SERVER)
import PropertiesAdminClient from "@/components/shared/PropertiesAdminPage/PropertiesAdminPage";

import { PropertyService } from "@/server/services/property.service";
import { propertyResponseDTO } from "@/dtos/property/property-response.dto";
import { QueryPropertyDTO } from "@/dtos/property/query-property.dto";

export default async function PropertiesAdminPage() {
  const { items } = await PropertyService.findAll(new QueryPropertyDTO({}));

  const properties = items.map(p => propertyResponseDTO(p));
  console.log('properties service', properties)

  return <PropertiesAdminClient initialProperties={properties} />;
}
