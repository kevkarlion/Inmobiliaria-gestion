import { PropertyController } from "@/server/controllers/property.controller";

export async function GET(req: Request) {
  return PropertyController.getAll(req)
}

export async function POST(req: Request) {
  return PropertyController.create(req);
}
