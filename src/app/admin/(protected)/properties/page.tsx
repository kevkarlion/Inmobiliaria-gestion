// app/admin/properties/page.tsx (SERVER)
export const dynamic = "force-dynamic";
export const revalidate = 0;
import PropertiesAdminClient from "@/components/shared/PropertiesAdminPage/PropertiesAdminPage";
import { PropertyService } from "@/server/services/property.service";
import { propertyResponseDTO } from "@/dtos/property/property-response.dto";
import { QueryPropertyDTO } from "@/dtos/property/query-property.dto";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function PropertiesAdminPage() {
  // Obtener usuario actual para filtrar
  const currentUser = await getCurrentUser();
  
  const { items } = await PropertyService.findAll(new QueryPropertyDTO({}), currentUser);
  const properties = items.map(p => propertyResponseDTO(p));

  return (
    <PropertiesAdminClient initialProperties={properties}>
      {/* Pasamos las cards como children o las renderizamos dentro del cliente si necesitan estado */}
      {/* En este caso, el Cliente las renderizará para poder filtrarlas/borrarlas en tiempo real */}
    </PropertiesAdminClient>
  );
}