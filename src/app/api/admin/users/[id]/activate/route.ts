import { activateUser } from "@/server/controllers/admin-user.controller";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return activateUser(req, { params: resolvedParams });
}
