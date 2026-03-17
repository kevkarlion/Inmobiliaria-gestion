import { AuditLogModel } from "@/domain/models/AuditLog";
import { AuditAction, AuditEntity } from "@/dtos/audit/query-audit-log.dto";

export class AuditLogRepository {
  static async create(data: {
    action: AuditAction;
    entity: AuditEntity;
    entityId: string;
    userId: string;
    userEmail: string;
    changes?: any;
    description: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const log = new AuditLogModel(data);
    return log.save();
  }

  static async findAll(query: {
    action?: AuditAction;
    entity?: AuditEntity;
    userId?: string;
    entityId?: string;
    startDate?: Date;
    endDate?: Date;
    sortBy: string;
    sortOrder: "asc" | "desc";
    skip: number;
    limit: number;
  }) {
    const filter: any = {};

    if (query.action) {
      filter.action = query.action;
    }

    if (query.entity) {
      filter.entity = query.entity;
    }

    if (query.userId) {
      filter.userId = query.userId;
    }

    if (query.entityId) {
      filter.entityId = query.entityId;
    }

    if (query.startDate || query.endDate) {
      filter.createdAt = {};
      if (query.startDate) {
        filter.createdAt.$gte = query.startDate;
      }
      if (query.endDate) {
        filter.createdAt.$lte = query.endDate;
      }
    }

    const sort: any = {};
    sort[query.sortBy] = query.sortOrder === "asc" ? 1 : -1;

    const [items, total] = await Promise.all([
      AuditLogModel.find(filter)
        .sort(sort)
        .skip(query.skip)
        .limit(query.limit)
        .lean(),
      AuditLogModel.countDocuments(filter),
    ]);

    return { items, total };
  }

  static async findByEntity(entity: AuditEntity, entityId: string) {
    return AuditLogModel.find({ entity, entityId })
      .sort({ createdAt: -1 })
      .lean();
  }

  static async findByUser(userId: string, limit = 50) {
    return AuditLogModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}
