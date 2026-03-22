/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlogPostRepository } from "../repositories/blog-post.repository";
import { CreateBlogPostDTO } from "@/dtos/blog/create-blog-post.dto";
import { UpdateBlogPostDTO } from "@/dtos/blog/update-blog-post.dto";
import { QueryBlogPostDTO } from "@/dtos/blog/query-blog-post.dto";
import { NotFoundError } from "@/server/errors/http-error";
import { BlogPostModel } from "@/db/schemas/blog-post.schema";
import { connectDB } from "@/db/connection";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/slugify";

export interface PaginatedBlogPosts {
  items: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export class BlogPostService {
  static async create(dto: CreateBlogPostDTO): Promise<any> {
    // Verificar slug único
    let slug = dto.slug || slugify(dto.title);
    let slugExists = await BlogPostModel.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${slugify(dto.title)}-${counter}`;
      slugExists = await BlogPostModel.findOne({ slug });
      counter++;
    }

    const data: Record<string, any> = {
      title: dto.title,
      slug,
      excerpt: dto.excerpt,
      content: dto.content,
      category: dto.category,
      tags: dto.tags,
      featuredImage: dto.featuredImage,
      author: dto.author,
      status: dto.status,
      readingTime: dto.readingTime,
    };

    if (dto.seoTitle) data.seoTitle = dto.seoTitle;
    if (dto.seoDescription) data.seoDescription = dto.seoDescription;

    // Si se publica directamente, setear publishedAt
    if (dto.status === "published") {
      data.publishedAt = new Date();
    }

    const saved = await BlogPostRepository.create(data);

    // Revalidation
    revalidatePath("/novedades");
    revalidatePath("/novedades/pagina");
    revalidatePath("/novedades/sitemap.xml", "page");

    return saved;
  }

  static async findAll(query: QueryBlogPostDTO): Promise<PaginatedBlogPosts> {
    await connectDB();
    const filter: any = { status: "published" };

    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;

    const { skip, limit, page } = query;
    const sort = { publishedAt: -1, createdAt: -1 } as Record<string, 1 | -1>;

    const [items, total] = await Promise.all([
      BlogPostRepository.findAll(filter, { sort, skip, limit }),
      BlogPostRepository.count(filter),
    ]);

    return {
      items: items.map((item: any) => ({
        ...item,
        _id: item._id.toString(),
      })),
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async findAllAdmin(query: QueryBlogPostDTO): Promise<PaginatedBlogPosts> {
    await connectDB();
    const filter: any = {};

    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;

    const { skip, limit, page } = query;
    const sort = { publishedAt: -1, createdAt: -1 } as Record<string, 1 | -1>;

    const [items, total] = await Promise.all([
      BlogPostRepository.findAll(filter, { sort, skip, limit }),
      BlogPostRepository.count(filter),
    ]);

    return {
      items: items.map((item: any) => ({
        ...item,
        _id: item._id.toString(),
      })),
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async findBySlug(slug: string): Promise<any> {
    await connectDB();
    const post = await BlogPostRepository.findBySlug(slug);
    if (!post) throw new NotFoundError("Post no encontrado");
    return { ...post, _id: post._id.toString() };
  }

  static async findById(id: string): Promise<any> {
    await connectDB();
    const post = await BlogPostRepository.findById(id);
    if (!post) throw new NotFoundError("Post no encontrado");
    return { ...post, _id: post._id.toString() };
  }

  static async findLatestPublished(limit = 1): Promise<any[]> {
    await connectDB();
    const posts = await BlogPostRepository.findLatestPublished(limit);
    return posts.map((p: any) => ({ ...p, _id: p._id.toString() }));
  }

  static async update(id: string, dto: UpdateBlogPostDTO): Promise<any> {
    await connectDB();

    const existing = await BlogPostRepository.findById(id);
    if (!existing) throw new NotFoundError("Post no encontrado");

    const updateData: Record<string, any> = {};

    // Slug
    if (dto.slug !== undefined) {
      updateData.slug = dto.slug || slugify(dto.title || existing.title);
    } else if (dto.title !== undefined && dto.title !== existing.title) {
      // Regenerar slug si cambia el título
      const newSlug = slugify(dto.title);
      let slugExists = await BlogPostModel.findOne({ slug: newSlug });
      let counter = 1;
      while (slugExists && slugExists._id.toString() !== id) {
        const s = `${slugify(dto.title)}-${counter}`;
        slugExists = await BlogPostModel.findOne({ slug: s });
        counter++;
      }
      updateData.slug = slugExists ? `${slugify(dto.title)}-${counter}` : newSlug;
    }

    // Simple fields
    const simpleFields = [
      "title",
      "excerpt",
      "content",
      "category",
      "tags",
      "featuredImage",
      "author",
    ] as const;
    for (const field of simpleFields) {
      if (dto[field] !== undefined) updateData[field] = (dto as any)[field];
    }

    // SEO
    if (dto.seoTitle !== undefined) updateData.seoTitle = dto.seoTitle || undefined;
    if (dto.seoDescription !== undefined)
      updateData.seoDescription = dto.seoDescription || undefined;

    // Status change → set publishedAt
    if (dto.status !== undefined) {
      updateData.status = dto.status;
      if (dto.status === "published" && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
      // Si vuelve a draft, no tocamos publishedAt
    }

    // Reading time recalculate if content changed
    if (dto.content !== undefined) {
      const wordCount = (dto.content.replace(/<[^>]*>/g, "") || "").split(/\s+/).filter(Boolean).length;
      updateData.readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    const updated = await BlogPostRepository.update(id, updateData);

    // Revalidation
    revalidatePath("/novedades");
    revalidatePath(`/novedades/${existing.slug}`);
    revalidatePath(`/novedades/${existing.category}`);
    revalidatePath("/novedades/pagina");
    revalidatePath("/novedades/sitemap.xml", "page");

    return { ...updated, _id: updated._id.toString() };
  }

  static async delete(id: string): Promise<{ message: string }> {
    await connectDB();
    const existing = await BlogPostRepository.findById(id);
    if (!existing) throw new NotFoundError("Post no encontrado");

    await BlogPostRepository.delete(id);

    // Revalidation
    revalidatePath("/novedades");
    revalidatePath(`/novedades/${existing.slug}`);
    revalidatePath(`/novedades/${existing.category}`);
    revalidatePath("/novedades/pagina");

    return { message: "Post eliminado correctamente" };
  }

  static async findAllForSitemap() {
    return BlogPostRepository.findAllForSitemap();
  }
}
