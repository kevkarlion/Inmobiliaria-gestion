// domain/types/Requirement.types.ts

/**
 * Tipos relacionados con Requirements para matching inverso
 * Un Requirement representa una necesidad de propiedad de un cliente
 */

/**
 * Zona requerida
 */
export interface RequirementZone {
  province?: string;
  city?: string;
  barrio?: string;
}

/**
 * Rango de precio requerido
 */
export interface RequirementPriceRange {
  min: number;
  max?: number;
}

/**
 * Características requeridas
 */
export interface RequirementFeatures {
  bedrooms: number;
  bathrooms: number;
  minM2: number;
  garage?: boolean;
}

/**
 * Requerimiento de propiedad (del lado del cliente)
 */
export interface Requirement {
  _id: string;
  clientId: string;
  operationType: "venta" | "alquiler";
  propertyTypes: string[];
  zones: RequirementZone[];
  priceRange: RequirementPriceRange;
  features: RequirementFeatures;
  status: "active" | "matched" | "fulfilled" | "cancelled" | "expired";
  priority: "low" | "medium" | "high";
  notes?: string;
  expiresAt?: Date;
  matchedProperties: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Formato de respuesta para listados paginados de requirements
 */
export interface FindAllRequirementsResult {
  items: Requirement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
