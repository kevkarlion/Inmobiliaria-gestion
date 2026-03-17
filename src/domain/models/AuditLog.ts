import { Schema, model, models } from "mongoose";

export type AuditAction = 
  | "create" 
  | "update" 
  | "delete" 
  | "login" 
  | "logout"
  | "activate"
  | "deactivate";

export type AuditEntity = 
  | "user" 
  | "property" 
  | "client" 
  | "requirement";

const AuditLogSchema = new Schema(
  {
    action: {
      type: String,
      enum: ["create", "update", "delete", "login", "logout", "activate", "deactivate"],
      required: true,
    },
    entity: {
      type: String,
      enum: ["user", "property", "client", "requirement"],
      required: true,
    },
    entityId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    changes: {
      type: Schema.Types.Mixed,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "audit_logs",
  }
);

// Index for efficient querying
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ entity: 1, entityId: 1 });

export const AuditLogModel = models.AuditLog || model("AuditLog", AuditLogSchema);
