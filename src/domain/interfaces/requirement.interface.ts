import { Document, Types } from "mongoose";
import { RequirementStatus } from "@/domain/enums/requirement-status.enum";

/**
 * Interfaz para el documento Requirement en MongoDB
 * Representa una necesidad de propiedad de un cliente (para matching inverso)
 */
export interface IRequirement extends Document {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  operationType: "venta" | "alquiler";
  propertyTypes: Types.ObjectId[];

  zones: {
    province?: Types.ObjectId;
    city?: Types.ObjectId;
    barrio?: string;
  }[];

  priceRange: {
    min: number;
    max?: number;
  };

  features: {
    bedrooms: number;
    bathrooms: number;
    minM2: number;
    garage?: boolean;
  };

  status: RequirementStatus;
  priority: "low" | "medium" | "high";
  notes?: string;
  expiresAt?: Date;
  matchedProperties: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}
