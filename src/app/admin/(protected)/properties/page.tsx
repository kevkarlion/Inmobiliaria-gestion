// app/admin/properties/page.tsx (SERVER)
export const dynamic = "force-dynamic";
export const revalidate = 0;
import PropertiesAdminClient from "@/components/shared/PropertiesAdminPage/PropertiesAdminPage";
import { PropertyService } from "@/server/services/property.service";
import { propertyResponseDTO } from "@/dtos/property/property-response.dto";
import { QueryPropertyDTO } from "@/dtos/property/query-property.dto";
import { getCurrentUser } from "@/lib/auth";
import { UserService } from "@/server/services/user.service";

const PAGE_LIMIT = 10;

export default async function PropertiesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const filter = params.filter || "all";

  const currentUser = await getCurrentUser();

  const queryDto = new QueryPropertyDTO({ page, limit: PAGE_LIMIT });
  
  // Apply filter based on filter value - only set userId filter when explicitly requested
  if (filter === "mine" && currentUser) {
    // Filter by current user
    queryDto.filters.userId = currentUser.id;
  } else if (filter && filter !== "all" && filter !== "mine") {
    // Filter by specific user ID
    queryDto.filters.userId = filter;
  }
  
  const { items, meta } = await PropertyService.findAll(queryDto, currentUser);
  const properties = items.map((p) => propertyResponseDTO(p));

  // Get all users for filter dropdown
  let users: { id: string; email: string }[] = [];
  const usersResult = await UserService.findAll(
    { page: 1, limit: 100, sortBy: "email", sortOrder: "asc" },
    { userId: currentUser?.id || "", email: currentUser?.email || "" }
  );
  users = usersResult.items
    .filter(u => u.active !== false) // Only active users
    .map(u => ({ id: u.id, email: u.email }));

  return (
    <PropertiesAdminClient
      initialProperties={properties}
      meta={meta}
      page={page}
      currentUser={currentUser ? { id: currentUser.id, isAdmin: currentUser.isAdmin } : null}
      filter={filter}
      users={users}
    />
  );
}