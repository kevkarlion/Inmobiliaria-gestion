// mappers/propertyToForm.mapper.ts
//mapea datos de mi rta de mi backend a datos entendibles para mi formulario

import { PropertyResponseDTO } from "@/dtos/property/property-response.dto";
import { UpdatePropertyDTO } from "@/dtos/property/update-property.dto";


function normalizeOperation(
  value: string
): "venta" | "alquiler" {
  return value === "alquiler" ? "alquiler" : "venta";
}

function normalizeCurrency(
  value: string
): "USD" | "ARS" {
  return value === "ARS" ? "ARS" : "USD";
}

function normalizeStatus(
  value?: string
): "active" | "inactive" {
  return value === "inactive" ? "inactive" : "active";
}



export function mapPropertyToForm(
  property: PropertyResponseDTO
): UpdatePropertyDTO {
  return {
    title: property.title,
    operationType: normalizeOperation(property.operationType),
    propertyTypeSlug: property.propertyType.slug,
    zoneSlug: property.zone.slug,

    address: property.address,

    price: {
      amount: property.price.amount,
      currency: normalizeCurrency(property.price.currency),
    },

    features: property.features,
    flags: property.flags,

    description: property.description,
    tags: property.tags ?? [],
    images: property.images ?? [],
    status: normalizeStatus(property.status),
  };
}

