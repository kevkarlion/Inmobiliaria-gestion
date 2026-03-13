/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequirementStatus } from "@/domain/enums/requirement-status.enum";

export class UpdateRequirementDTO {
  operationType?: "venta" | "alquiler";
  propertyTypes?: string[];

  zones?: {
    province?: string;
    city?: string;
    barrio?: string;
  }[];

  priceRange?: {
    min?: number;
    max?: number;
  };

  features?: {
    bedrooms?: number;
    bathrooms?: number;
    minM2?: number;
    garage?: boolean;
  };

  status?: RequirementStatus;
  priority?: "low" | "medium" | "high";
  notes?: string;
  expiresAt?: Date;
  matchedProperties?: string[];

  constructor(data: any) {
    this.operationType = data.operationType;
    this.propertyTypes = data.propertyTypes;

    if (data.zones !== undefined) {
      this.zones = data.zones;
    }

    if (data.priceRange !== undefined) {
      this.priceRange = {
        min: data.priceRange.min !== undefined ? Number(data.priceRange.min) : undefined,
        max: data.priceRange.max !== undefined ? Number(data.priceRange.max) : undefined,
      };
    }

    if (data.features !== undefined) {
      this.features = {
        bedrooms: data.features.bedrooms !== undefined ? Number(data.features.bedrooms) : undefined,
        bathrooms: data.features.bathrooms !== undefined ? Number(data.features.bathrooms) : undefined,
        minM2: data.features.minM2 !== undefined ? Number(data.features.minM2) : undefined,
        garage: data.features.garage,
      };
    }

    this.status = data.status;
    this.priority = data.priority;
    this.notes = data.notes;
    this.expiresAt = data.expiresAt ? new Date(data.expiresAt) : undefined;
    this.matchedProperties = data.matchedProperties;
  }
}
