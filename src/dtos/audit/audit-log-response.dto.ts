export interface AuditLogResponse {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  userEmail: string;
  changes: any;
  description: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export function auditLogResponseDTO(log: any): AuditLogResponse {
  return {
    id: log._id?.toString() || log.id,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    userId: log.userId?.toString() || log.userId,
    userEmail: log.userEmail,
    changes: log.changes,
    description: log.description,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    createdAt: log.createdAt,
  };
}
