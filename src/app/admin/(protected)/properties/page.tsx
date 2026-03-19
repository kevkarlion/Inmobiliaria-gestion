// app/admin/properties/page.tsx (SERVER)
export const dynamic = "force-dynamic";
export const revalidate = 0;
import PropertiesAdminClient from "@/components/shared/PropertiesAdminPage/PropertiesAdminPage";
import { PropertyService } from "@/server/services/property.service";
import { propertyResponseDTO } from "@/dtos/property/property-response.dto";
import { QueryPropertyDTO } from "@/dtos/property/query-property.dto";
import { getCurrentUser } from "@/lib/auth";

const PAGE_LIMIT = 10;

export default async function PropertiesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);

  const currentUser = await getCurrentUser();

  const queryDto = new QueryPropertyDTO({ page, limit: PAGE_LIMIT });
  const { items, meta } = await PropertyService.findAll(queryDto, currentUser);
  const properties = items.map((p) => propertyResponseDTO(p));

  return (
    <PropertiesAdminClient
      initialProperties={properties}
      meta={meta}
      page={page}
    />
  );
}