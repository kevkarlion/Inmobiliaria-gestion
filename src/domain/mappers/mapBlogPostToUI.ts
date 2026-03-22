/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlogPostUI } from "@/domain/types/BlogPostUI.types";
import { BlogCategoryMeta, BLOG_CATEGORIES } from "@/lib/blogCategories";
import { BlogCategory } from "@/domain/enums/blog-category.enum";

function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString();
}

function formatDateLong(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCategoryLabel(category: BlogCategory): string {
  const found = BLOG_CATEGORIES.find((c: BlogCategoryMeta) => c.slug === category);
  return found?.label || category;
}

export function mapBlogPostToUI(post: any): BlogPostUI {
  const category = post.category as BlogCategory;
  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt)
    : post.createdAt
    ? new Date(post.createdAt)
    : null;

  return {
    id: post._id?.toString() || post.id || "",
    title: post.title || "Sin título",
    slug: post.slug || "",
    excerpt: post.excerpt || "",
    content: post.content || "",
    category,
    categoryLabel: getCategoryLabel(category),
    categorySlug: category,
    tags: post.tags || [],
    featuredImage: post.featuredImage || "",
    author: post.author || "Riquelme Propiedades",
    publishedAt: publishedAt ? formatDate(publishedAt) : "",
    publishedAtFormatted: publishedAt ? formatDateLong(publishedAt) : "",
    readingTime: post.readingTime || calculateReadingTime(post.content || ""),
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    createdAt: post.createdAt ? formatDate(new Date(post.createdAt)) : undefined,
    updatedAt: post.updatedAt ? formatDate(new Date(post.updatedAt)) : undefined,
  };
}

export { calculateReadingTime };
