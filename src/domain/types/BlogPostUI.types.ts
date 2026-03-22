import { BlogCategory } from "@/domain/enums/blog-category.enum";

export interface BlogPostUI {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  categoryLabel: string;
  categorySlug: string;
  tags: string[];
  featuredImage: string;
  author: string;
  publishedAt: string;
  publishedAtFormatted: string;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}
