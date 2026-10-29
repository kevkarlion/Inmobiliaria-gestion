/* eslint-disable @typescript-eslint/no-explicit-any */
import { BLOG_CATEGORY_VALUES } from "@/domain/enums/blog-category.enum";

export class QueryBlogPostDTO {
  status?: "draft" | "published";
  category?: string;
  /** Solo los posts seleccionados para la home. */
  featuredOnHome?: boolean;
  page: number;
  limit: number;

  constructor(data: any) {
    if (data.status && !["draft", "published"].includes(data.status)) {
      this.status = undefined;
    } else {
      this.status = data.status;
    }

    if (data.category && BLOG_CATEGORY_VALUES.includes(data.category)) {
      this.category = data.category;
    } else {
      this.category = undefined;
    }

    if (data.featuredOnHome === true || data.featuredOnHome === "true") {
      this.featuredOnHome = true;
    } else if (data.featuredOnHome === false || data.featuredOnHome === "false") {
      this.featuredOnHome = false;
    }

    const page = parseInt(data.page, 10);
    this.page = isNaN(page) || page < 1 ? 1 : page;

    const limit = parseInt(data.limit, 10);
    this.limit = isNaN(limit) || limit < 1 ? 9 : Math.min(limit, 50);
  }

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
