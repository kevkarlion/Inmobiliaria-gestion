import { AuditLogController } from "@/server/controllers/audit-log.controller";

export async function GET(req: Request) {
  return AuditLogController.getAll(req);
}
