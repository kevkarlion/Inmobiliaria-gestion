//src/app/api/properties/[slug]/route.ts

import { PropertyController } from "@/server/controllers/property.controller";

export async function GET(
  req: Request, context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  return PropertyController.getBySlug(req, { params: { slug } });
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return PropertyController.update(req, { params: resolvedParams });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return PropertyController.delete(req, { params: resolvedParams });
}



