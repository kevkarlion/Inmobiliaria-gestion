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

  static findBySlug(slug: string) {
    return BlogPostModel.findOne({ slug }).lean();
  }

  static findByCategory(category: string, filter: any, options: FindAllOptions = {}) {
    return BlogPostModel.find({ category, ...filter })
      .select(
        "title slug excerpt category tags featuredImage author status publishedAt readingTime seoTitle seoDescription createdAt updatedAt",
      )
      .sort(options.sort || { publishedAt: -1, createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit ?? DEFAULT_LIMIT)
      .lean();
  }

  static findLatestPublished(limit = 1) {
    return BlogPostModel.find({ status: "published" })
      .select(
        "title slug excerpt category tags featuredImage author publishedAt readingTime",
      )
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
  }

  static count(filter: any) {
    return BlogPostModel.countDocuments(filter);
  }

  static create(data: any) {
    return BlogPostModel.create(data);
  }

  static update(id: string, data: any) {
    return BlogPostModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  static delete(id: string) {
    return BlogPostModel.findByIdAndDelete(id);
  }

  static findById(id: string) {
    return BlogPostModel.findById(id).lean();
  }

  static async findAllForSitemap() {
    await connectDB();
    return BlogPostModel.find({ status: "published" })
      .select("slug updatedAt publishedAt")
      .lean();
  }
}
