import { PropertyController } from "@/server/controllers/property.controller";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  return PropertyController.getBySlug(req, { params: { slug } });
}
