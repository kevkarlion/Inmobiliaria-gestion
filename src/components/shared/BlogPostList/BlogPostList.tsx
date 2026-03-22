"use client";

import Link from "next/link";
import { BlogPostUI } from "@/domain/types/BlogPostUI.types";
import { BLOG_CATEGORIES } from "@/lib/blogCategories";
import { BlogPostCard } from "@/components/shared/BlogPostCard/BlogPostCard";

interface Props {
  posts: BlogPostUI[];
  currentPage: number;
  pages: number;
  currentCategory?: string;
}

export function BlogPostList({
  posts,
  currentPage,
  pages,
  currentCategory,
}: Props) {
  function getPageUrl(page: number) {
    const basePath = currentCategory
      ? `/novedades/${currentCategory}`
      : "/novedades";
    return page === 1 ? basePath : `${basePath}/pagina/${page}`;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Grid */}
      <div className="flex-1">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-500">
            <p className="text-lg">No hay publicaciones{currentCategory ? " en esta categoría" : ""} todavía.</p>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={getPageUrl(page)}
                scroll={false}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  page === currentPage
                    ? "bg-primary text-white border-primary"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 hover:border-primary"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="lg:w-72 shrink-0">
        <div className="sticky top-24">
          <h3 className="font-bold text-lg mb-4 text-neutral-900 dark:text-white">
            Categorías
          </h3>
          <div className="space-y-2">
            <Link
              href="/novedades"
              scroll={false}
              className={`block px-4 py-2 rounded-lg border text-sm transition-colors ${
                !currentCategory
                  ? "bg-primary/10 border-primary text-primary font-medium"
                  : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 hover:border-primary/50"
              }`}
            >
              Todas las novedades
            </Link>
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/novedades/${cat.slug}`}
                scroll={false}
                className={`block px-4 py-2 rounded-lg border text-sm transition-colors ${
                  cat.slug === currentCategory
                    ? "bg-primary/10 border-primary text-primary font-medium"
                    : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 hover:border-primary/50"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
