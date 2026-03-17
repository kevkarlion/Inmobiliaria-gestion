import { AdminUserController } from "@/server/controllers/admin-user.controller";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  return AdminUserController.getAll(req);
}

export async function POST(req: Request) {
  return AdminUserController.create(req);
}
