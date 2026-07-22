import { PropertyController } from "@/server/controllers/property.controller";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  return PropertyController.toggleActive(req, { params: resolvedParams });
}
