import { BlogPostController } from "@/server/controllers/blog-post.controller";

export async function GET(req: Request) {
  return BlogPostController.getAll(req);
}

export async function POST(req: Request) {
  return BlogPostController.create(req);
}

export async function PUT(req: Request) {
  return BlogPostController.update(req);
}

export async function DELETE(req: Request) {
  return BlogPostController.remove(req);
}
