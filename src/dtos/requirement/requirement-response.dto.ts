/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequirementStatus } from "@/domain/enums/requirement-status.enum";

export interface RequirementResponse {
  id: string;
  clientId: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  operationType: string;
  propertyTypes: {
    id: string;
    name: string;
    slug: string;
  }[];

  zones: {
    province: {
      id: string;
      name: string;
      slug: string;
    } | null;
    city: {
      id: string;
      name: string;
      slug: string;
    } | null;
    barrio: string | null;
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
  priority: string;
  notes?: string;
  expiresAt?: Date;
  matchedProperties: {
    id: string;
    title: string;
    slug: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

export function requirementResponseDTO(requirement: any): RequirementResponse {
  return {
    id: requirement._id.toString(),
    clientId: {
      id: requirement.clientId._id?.toString() || requirement.clientId.toString(),
      name: requirement.clientId.name || "",
      email: requirement.clientId.email || "",
      phone: requirement.clientId.phone || "",
    },
    operationType: requirement.operationType,
    propertyTypes: (requirement.propertyTypes || []).map((pt: any) => ({
      id: pt._id?.toString() || pt.toString(),
      name: pt.name || "",
      slug: pt.slug || "",
    })),
    zones: (requirement.zones || []).map((zone: any) => ({
      province: zone.province
        ? {
            id: zone.province._id?.toString(),
            name: zone.province.name,
            slug: zone.province.slug,
          }
        : null,
      city: zone.city
        ? {
            id: zone.city._id?.toString(),
            name: zone.city.name,
            slug: zone.city.slug,
          }
        : null,
      barrio: zone.barrio || null,
    })),
    priceRange: {
      min: requirement.priceRange?.min || 0,
      max: requirement.priceRange?.max,
    },
    features: {
      bedrooms: requirement.features?.bedrooms || 0,
      bathrooms: requirement.features?.bathrooms || 0,
      minM2: requirement.features?.minM2 || 0,
      garage: requirement.features?.garage,
    },
    status: requirement.status,
    priority: requirement.priority || "medium",
    notes: requirement.notes,
    expiresAt: requirement.expiresAt,
    matchedProperties: (requirement.matchedProperties || []).map((prop: any) => ({
      id: prop._id?.toString() || prop.toString(),
      title: prop.title || "",
      slug: prop.slug || "",
    })),
    createdAt: requirement.createdAt,
    updatedAt: requirement.updatedAt,
  };
}
