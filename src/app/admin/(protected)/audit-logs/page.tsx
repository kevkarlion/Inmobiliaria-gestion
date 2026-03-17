// app/admin/audit-logs/page.tsx (SERVER)
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import { redirect } from "next/navigation";
import AuditLogsClient from "./AuditLogsClient";
import { AuditService } from "@/server/services/audit.service";
import { auditLogResponseDTO, AuditLogResponse } from "@/dtos/audit/audit-log-response.dto";
import { QueryAuditLogDTO } from "@/dtos/audit/query-audit-log.dto";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  
  if (!token) {
    redirect("/admin/login");
  }
  
  try {
    const decoded = verifyToken(token);
    if ((decoded as any).role !== "admin") {
      redirect("/admin/properties");
    }
    return decoded;
  } catch {
    redirect("/admin/login");
  }
}

export default async function AuditLogsPage() {
  await checkAdmin();
  
  const queryDto = new QueryAuditLogDTO({ page: 1, limit: 50 });
  const { items } = await AuditService.findAll(queryDto);
  const logs: AuditLogResponse[] = items.map(auditLogResponseDTO);

  return <AuditLogsClient initialLogs={logs} />;
}
