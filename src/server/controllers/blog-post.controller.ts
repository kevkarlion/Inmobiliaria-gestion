import { connectDB } from "@/db/connection";
import { BlogPostService } from "@/server/services/blog-post.service";
import { NextResponse } from "next/server";
import { HttpError } from "@/server/errors/http-error";
import { QueryBlogPostDTO } from "@/dtos/blog/query-blog-post.dto";
import { CreateBlogPostDTO } from "@/dtos/blog/create-blog-post.dto";
import { UpdateBlogPostDTO } from "@/dtos/blog/update-blog-post.dto";

export class BlogPostController {
  private static handleError(error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }

  // GET /api/admin/blog-post
  static async getAll(req: Request) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const rawQuery = Object.fromEntries(searchParams);

      const isAdmin = searchParams.get("isAdmin") === "true";
      const queryDto = new QueryBlogPostDTO(rawQuery);

      const result = isAdmin
        ? await BlogPostService.findAllAdmin(queryDto)
        : await BlogPostService.findAll(queryDto);

      return NextResponse.json(result);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // POST /api/admin/blog-post
  static async create(req: Request) {
    try {
      await connectDB();
      const body = await req.json();
      const dto = new CreateBlogPostDTO(body);
      const post = await BlogPostService.create(dto);
      return NextResponse.json(post, { status: 201 });
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // PUT /api/admin/blog-post?id=xxx
  static async update(req: Request) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json(
          { message: "ID es requerido" },
          { status: 400 },
        );
      }

      const body = await req.json();
      const dto = new UpdateBlogPostDTO(body);
      const post = await BlogPostService.update(id, dto);
      return NextResponse.json(post);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }

  // DELETE /api/admin/blog-post?id=xxx
  static async remove(req: Request) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json(
          { message: "ID es requerido" },
          { status: 400 },
        );
      }

      const result = await BlogPostService.delete(id);
      return NextResponse.json(result);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }
}
