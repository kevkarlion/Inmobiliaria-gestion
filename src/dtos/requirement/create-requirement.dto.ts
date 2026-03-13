/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";
import { RequirementStatus } from "@/domain/enums/requirement-status.enum";

export class CreateRequirementDTO {
  clientId: string;
  operationType: "venta" | "alquiler";
  propertyTypes: string[];

  zones: {
    province?: string;
    city?: string;
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

  constructor(data: any) {
    if (!data.clientId) {
      throw new BadRequestError("El ID del cliente es requerido");
    }

    if (!data.operationType || !["venta", "alquiler"].includes(data.operationType)) {
      throw new BadRequestError("El tipo de operación es requerido (venta o alquiler)");
    }

    if (!data.propertyTypes || !Array.isArray(data.propertyTypes) || data.propertyTypes.length === 0) {
      throw new BadRequestError("Al menos un tipo de propiedad es requerido");
    }

    this.clientId = data.clientId;
    this.operationType = data.operationType;
    this.propertyTypes = data.propertyTypes;
    this.zones = data.zones || [];

    this.priceRange = {
      min: Number(data.priceRange?.min) || 0,
      max: data.priceRange?.max ? Number(data.priceRange.max) : undefined,
    };

    this.features = {
      bedrooms: Number(data.features?.bedrooms) || 0,
      bathrooms: Number(data.features?.bathrooms) || 0,
      minM2: Number(data.features?.minM2) || 0,
      garage: data.features?.garage || false,
    };

    this.status = data.status || RequirementStatus.ACTIVE;
    this.priority = data.priority || "medium";
    this.notes = data.notes;
    this.expiresAt = data.expiresAt ? new Date(data.expiresAt) : undefined;
  }
}
