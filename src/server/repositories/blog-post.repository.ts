/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlogPostModel } from "@/db/schemas/blog-post.schema";
import { connectDB } from "@/db/connection";

type FindAllOptions = {
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
};

const DEFAULT_LIMIT = 9;

export class BlogPostRepository {
  static async findAll(filter: any, options: FindAllOptions = {}) {
    await connectDB();
    return BlogPostModel.find(filter)
      .select(
        "title slug excerpt category tags featuredImage author status publishedAt readingTime seoTitle seoDescription createdAt updatedAt",
      )
      .sort(options.sort || { publishedAt: -1, createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit ?? DEFAULT_LIMIT)
      .lean();
  }

  static async findBySlug(slug: string) {
    await connectDB();
    return BlogPostModel.findOne({ slug }).lean();
  }

  static async findByCategory(category: string, filter: any, options: FindAllOptions = {}) {
    await connectDB();
    return BlogPostModel.find({ category, ...filter })
      .select(
        "title slug excerpt category tags featuredImage author status publishedAt readingTime seoTitle seoDescription createdAt updatedAt",
      )
      .sort(options.sort || { publishedAt: -1, createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit ?? DEFAULT_LIMIT)
      .lean();
  }

  static async findLatestPublished(limit = 1) {
    await connectDB();
    return BlogPostModel.find({ status: "published" })
      .select(
        "title slug excerpt category tags featuredImage author publishedAt readingTime",
      )
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
  }

  static async count(filter: any) {
    await connectDB();
    return BlogPostModel.countDocuments(filter);
  }

  static async create(data: any) {
    await connectDB();
    return BlogPostModel.create(data);
  }

  static async update(id: string, data: any) {
    await connectDB();
    return BlogPostModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  static async delete(id: string) {
    await connectDB();
    return BlogPostModel.findByIdAndDelete(id);
  }

  static async findById(id: string) {
    await connectDB();
    return BlogPostModel.findById(id).lean();
  }

  static async findAllForSitemap() {
    await connectDB();
    return BlogPostModel.find({ status: "published" })
      .select("slug updatedAt publishedAt")
      .lean();
  }
}
