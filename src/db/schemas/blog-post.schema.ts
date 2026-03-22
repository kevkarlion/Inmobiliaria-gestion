import { Schema, model, models } from "mongoose";
import { IBlogPost } from "@/domain/interfaces/blog-post.interface";
import { BlogCategory, BLOG_CATEGORY_VALUES } from "@/domain/enums/blog-category.enum";

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 120,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: BLOG_CATEGORY_VALUES,
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "Riquelme Propiedades",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
    seoTitle: {
      type: String,
      maxlength: 120,
    },
    seoDescription: {
      type: String,
      maxlength: 160,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const BlogPostModel =
  models.BlogPost || model<IBlogPost>("BlogPost", BlogPostSchema);
