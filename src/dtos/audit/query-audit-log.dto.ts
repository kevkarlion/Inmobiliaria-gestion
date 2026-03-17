/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";

export type AuditAction = "create" | "update" | "delete" | "login" | "logout" | "activate" | "deactivate";
export type AuditEntity = "user" | "property" | "client" | "requirement";

export class QueryAuditLogDTO {
  page: number;
  limit: number;
  action?: AuditAction;
  entity?: AuditEntity;
  userId?: string;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy: string;
  sortOrder: "asc" | "desc";

  constructor(query: any) {
    this.page = Math.max(1, parseInt(query.page) || 1);
    this.limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));

    if (query.action) {
      const validActions: AuditAction[] = ["create", "update", "delete", "login", "logout", "activate", "deactivate"];
      if (!validActions.includes(query.action)) {
        throw new BadRequestError("Acción de audit inválida");
      }
      this.action = query.action;
    }

    if (query.entity) {
      const validEntities: AuditEntity[] = ["user", "property", "client", "requirement"];
      if (!validEntities.includes(query.entity)) {
        throw new BadRequestError("Entidad de audit inválida");
      }
      this.entity = query.entity;
    }

    if (query.userId) {
      this.userId = query.userId;
    }

    if (query.entityId) {
      this.entityId = query.entityId;
    }

    if (query.startDate) {
      this.startDate = new Date(query.startDate);
      if (isNaN(this.startDate.getTime())) {
        throw new BadRequestError("Fecha de inicio inválida");
      }
    }

    if (query.endDate) {
      this.endDate = new Date(query.endDate);
      if (isNaN(this.endDate.getTime())) {
        throw new BadRequestError("Fecha de fin inválida");
      }
    }

    const validSortFields = ["createdAt"];
    this.sortBy = validSortFields.includes(query.sortBy) ? query.sortBy : "createdAt";
    this.sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
  }
}
