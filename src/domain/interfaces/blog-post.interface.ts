import { Types } from "mongoose";
import { BlogCategory } from "@/domain/enums/blog-category.enum";

/**
 * Representa el post tal cual vive en MongoDB.
 * Se usa para el Schema y operaciones de escritura.
 */
export interface IBlogPost {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  featuredImage: string;
  author: string;
  status: "draft" | "published";
  publishedAt: Date | null;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Representa la entidad de dominio después del .lean() con _id string.
 * Se usa en los Servicios y Mappers.
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  featuredImage: string;
  author: string;
  status: "draft" | "published";
  publishedAt: Date | null;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
