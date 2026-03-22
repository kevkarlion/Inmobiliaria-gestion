export const dynamic = "force-dynamic";
export const revalidate = 0;

import { BlogPostService } from "@/server/services/blog-post.service";
import { QueryBlogPostDTO } from "@/dtos/blog/query-blog-post.dto";
import NovedadesAdminClient from "@/components/shared/NovedadesAdminPage/NovedadesAdminPage";

const PAGE_LIMIT = 12;

export default async function NovedadesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);
  const queryDto = new QueryBlogPostDTO({
    page,
    limit: PAGE_LIMIT,
    status: params.status,
    category: params.category,
  });

  const { items, meta } = await BlogPostService.findAllAdmin(queryDto);

  return (
    <NovedadesAdminClient
      initialPosts={items}
      meta={meta}
      page={page}
    />
  );
}
