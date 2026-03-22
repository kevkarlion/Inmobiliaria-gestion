/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";
import { BLOG_CATEGORY_VALUES } from "@/domain/enums/blog-category.enum";
import { slugify } from "@/lib/slugify";

export class UpdateBlogPostDTO {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  author?: string;
  status?: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;

  constructor(data: any) {
    if (data.title !== undefined) {
      if (!data.title) throw new BadRequestError("El título no puede estar vacío");
      if (data.title.length > 120)
        throw new BadRequestError("El título no puede superar los 120 caracteres");
      this.title = data.title.trim();
    }

    if (data.slug !== undefined) {
      this.slug = data.slug || slugify(data.title || "");
    }

    if (data.excerpt !== undefined) {
      if (!data.excerpt) throw new BadRequestError("El excerpt no puede estar vacío");
      if (data.excerpt.length > 300)
        throw new BadRequestError("El excerpt no puede superar los 300 caracteres");
      this.excerpt = data.excerpt.trim();
    }

    if (data.content !== undefined) {
      if (!data.content) throw new BadRequestError("El contenido no puede estar vacío");
      this.content = data.content;
    }

    if (data.category !== undefined) {
      if (!BLOG_CATEGORY_VALUES.includes(data.category))
        throw new BadRequestError(
          `Categoría inválida. Valores permitidos: ${BLOG_CATEGORY_VALUES.join(", ")}`
        );
      this.category = data.category;
    }

    this.tags = Array.isArray(data.tags) ? data.tags : undefined;
    this.featuredImage = data.featuredImage !== undefined ? data.featuredImage : undefined;
    this.author = data.author !== undefined ? data.author : undefined;
    this.status = data.status !== undefined
      ? (data.status === "published" ? "published" : "draft")
      : undefined;
    this.seoTitle = data.seoTitle?.trim() || undefined;
    this.seoDescription = data.seoDescription?.trim() || undefined;
  }
}
