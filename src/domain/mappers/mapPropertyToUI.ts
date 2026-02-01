/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyUI } from "@/domain/types/PropertyUI.types";

function normalizeOperation(value: string): "venta" | "alquiler" {
  if (value === "venta" || value === "alquiler") {
    return value;
  }
  return "venta"; // default de seguridad
}

export function mapPropertyToUI(property: any): PropertyUI {
  return {
    id: property.id || property._id?.toString(), 
    title: property.title,
    slug: property.slug,
    operationType: normalizeOperation(property.operationType),
    
    // Tipos y Zonas (Asumiendo que vienen poblados del DTO/DB)
    typeSlug: property.propertyType?.slug || "",
    typeName: property.propertyType?.name || "Propiedad",
    zoneSlug: property.zone?.slug || "",
    zoneName: property.zone?.name || "Consultar zona",

    // Dirección
    street: property.address?.street || "",
    number: property.address?.number || "",
    zipCode: property.address?.zipCode || "",

    // Precio
    amount: property.price?.amount || 0,
    currency: property.price?.currency || "USD",

    // Medidas y Ambientes
    bedrooms: property.features?.bedrooms || 0,
    bathrooms: property.features?.bathrooms || 0,
    totalM2: property.features?.totalM2 || 0,
    coveredM2: property.features?.coveredM2 || 0,
    rooms: property.features?.rooms || 0,
    garage: !!property.features?.garage,
    age: property.age || 0, // Añadido

    // Flags (Booleans)
    featured: !!property.flags?.featured,
    opportunity: !!property.flags?.opportunity,
    premium: !!property.flags?.premium,

    // Metadata
    tags: property.tags || [],
    images: property.images ?? [], 
    status: property.status || "active",
    description: property.description || "", // Añadido

    // Ubicación (Georeferencia)
    mapsUrl: property.location?.mapsUrl || null,
    lat: property.location?.lat || 0,
    lng: property.location?.lng || 0,
  };
}