import { Property } from "@/domain/types/Property.types";
import { PropertyUI } from "@/domain/types/PropertyUI.types";

function normalizeOperation(
  value: string,
): "venta" | "alquiler" {
  if (value === "venta" || value === "alquiler") {
    return value;
  }
  return "venta"; // default de seguridad
}

export function mapPropertyToUI(property: Property): PropertyUI {
  return {
    id: property._id, // Usa ambos por compatibilidad
    title: property.title,
   operationType: normalizeOperation(property.operationType),
    typeSlug: property.propertyType.slug,
    typeName: property.propertyType.name,

    zoneSlug: property.zone.slug,
    zoneName: property.zone.name,

    street: property.address.street,
    number: property.address.number,
    zipCode: property.address.zipCode,

    amount: property.price.amount,
    currency: property.price.currency,

    bedrooms: property.features.bedrooms,
    bathrooms: property.features.bathrooms,
    totalM2: property.features.totalM2,
    coveredM2: property.features.coveredM2,
    rooms: property.features.rooms,
    garage: property.features.garage,

    featured: property.flags.featured,
    opportunity: property.flags.opportunity,
    premium: property.flags.premium,

    tags: property.tags,
    image: property.images[0] ?? null,
    status: property.status,
  };
}
