import { AuditLogRepository } from "../repositories/audit-log.repository";
import { AuditAction, AuditEntity, QueryAuditLogDTO } from "@/dtos/audit/query-audit-log.dto";
import { auditLogResponseDTO, AuditLogResponse } from "@/dtos/audit/audit-log-response.dto";
import { connectDB } from "@/db/connection";

interface AuditLogInput {
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  userId: string;
  userEmail: string;
  description: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  /**
   * Registra una acción en el audit log
   */
  static async log(input: AuditLogInput): Promise<void> {
    await connectDB();

    await AuditLogRepository.create({
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      userId: input.userId,
      userEmail: input.userEmail,
      description: input.description,
      changes: input.changes,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
  }

  /**
   * Obtiene todos los logs con paginación
   */
  static async findAll(
    query: QueryAuditLogDTO
  ): Promise<{ items: AuditLogResponse[]; meta: any }> {
    await connectDB();

    const skip = (query.page - 1) * query.limit;

    const { items, total } = await AuditLogRepository.findAll({
      ...query,
      skip,
      limit: query.limit,
    });

    return {
      items: items.map(auditLogResponseDTO),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  /**
   * Obtiene los logs de una entidad específica
   */
  static async findByEntity(
    entity: AuditEntity,
    entityId: string
  ): Promise<AuditLogResponse[]> {
    await connectDB();

    const logs = await AuditLogRepository.findByEntity(entity, entityId);
    return logs.map(auditLogResponseDTO);
  }

  /**
   * Obtiene los logs de un usuario específico
   */
  static async findByUser(
    userId: string,
    limit = 50
  ): Promise<AuditLogResponse[]> {
    await connectDB();

    const logs = await AuditLogRepository.findByUser(userId, limit);
    return logs.map(auditLogResponseDTO);
  }
}
