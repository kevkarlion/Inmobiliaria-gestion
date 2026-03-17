import { AdminUserController } from "@/server/controllers/admin-user.controller";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return AdminUserController.getById(req, { params: resolvedParams });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return AdminUserController.update(req, { params: resolvedParams });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return AdminUserController.delete(req, { params: resolvedParams });
}
