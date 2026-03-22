/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";
import { BLOG_CATEGORY_VALUES } from "@/domain/enums/blog-category.enum";
import { slugify } from "@/lib/slugify";

export class CreateBlogPostDTO {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: string;
  status: "draft" | "published";
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;

  constructor(data: any) {
    if (!data.title) throw new BadRequestError("El título es requerido");
    if (data.title.length > 120)
      throw new BadRequestError("El título no puede superar los 120 caracteres");
    if (!data.excerpt) throw new BadRequestError("El excerpt es requerido");
    if (data.excerpt.length > 300)
      throw new BadRequestError("El excerpt no puede superar los 300 caracteres");
    if (!data.content) throw new BadRequestError("El contenido es requerido");
    if (!data.category) throw new BadRequestError("La categoría es requerida");
    if (!BLOG_CATEGORY_VALUES.includes(data.category))
      throw new BadRequestError(
        `Categoría inválida. Valores permitidos: ${BLOG_CATEGORY_VALUES.join(", ")}`
      );

    const wordCount = (data.content.replace(/<[^>]*>/g, "") || "").split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    this.title = data.title.trim();
    this.slug = data.slug || slugify(data.title);
    this.excerpt = data.excerpt.trim();
    this.content = data.content;
    this.category = data.category;
    this.tags = Array.isArray(data.tags) ? data.tags : [];
    this.featuredImage = data.featuredImage || "";
    this.author = data.author || "Riquelme Propiedades";
    this.status = data.status === "published" ? "published" : "draft";
    this.readingTime = readingTime;
    this.seoTitle = data.seoTitle?.trim() || undefined;
    this.seoDescription = data.seoDescription?.trim() || undefined;
  }
}
