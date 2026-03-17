import { connectDB } from "@/db/connection";
import { AuditService } from "@/server/services/audit.service";
import { NextResponse } from "next/server";
import { HttpError } from "@/server/errors/http-error";
import { QueryAuditLogDTO } from "@/dtos/audit/query-audit-log.dto";
import { requireAdmin } from "@/lib/auth";

export class AuditLogController {
  private static handleError(error: unknown) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }

  // GET /api/admin/audit-logs
  static async getAll(req: Request) {
    try {
      await connectDB();
      
      const currentUser = await requireAdmin();
      if (!currentUser) {
        return NextResponse.json(
          { message: "Acceso denegado" },
          { status: 403 },
        );
      }

      const { searchParams } = new URL(req.url);
      const query = new QueryAuditLogDTO(Object.fromEntries(searchParams));

      const result = await AuditService.findAll(query);

      return NextResponse.json(result);
    } catch (error: unknown) {
      return this.handleError(error);
    }
  }
}
