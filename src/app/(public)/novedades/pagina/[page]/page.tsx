import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";
import { BlogPostService } from "@/server/services/blog-post.service";
import { QueryBlogPostDTO } from "@/dtos/blog/query-blog-post.dto";

interface Props {
  params: Promise<{ page: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  if (isNaN(pageNum) || pageNum < 2) {
    return { title: "Novedades" };
  }

  const { meta } = await BlogPostService.findAll(
    new QueryBlogPostDTO({ page: pageNum, limit: 9 })
  );

  return {
    title: `Novedades - Página ${pageNum}`,
    alternates: {
      canonical: getCanonicalUrl(`/novedades/pagina/${pageNum}`),
    },
    openGraph: {
      title: `Novedades - Página ${pageNum} | Riquelme Propiedades`,
      url: `/novedades/pagina/${pageNum}`,
      type: "website",
    },
  };
}

export default async function PaginaPage({ params }: Props) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  if (isNaN(pageNum) || pageNum < 1) {
    redirect("/novedades");
  }

  if (pageNum === 1) {
    redirect("/novedades");
  }

  // The actual paginated listing lives on /novedades.
  // This page exists for SEO with proper metadata.
  // For now, redirect to root. In future, implement actual paginated listing.
  redirect("/novedades");
}
