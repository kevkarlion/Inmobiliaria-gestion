/* eslint-disable @typescript-eslint/no-explicit-any */
// mappers/propertyToForm.mapper.ts
import { PropertyResponse } from "@/dtos/property/property-response.dto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPropertyToForm(property: PropertyResponse): any {
  return {
    // Datos básicos
    title: property.title,
    slug: property.slug,
    operationType: property.operationType === "alquiler" ? "alquiler" : "venta",
    propertyTypeSlug: property.propertyType?.slug || "casa",

    // Ubicación (SOLO STRINGS)
    province:
      property.address?.province?.slug ||
      property.address?.province?.name ||
      "",
    city: property.address?.city?.slug || property.address?.city?.name || "",
    barrio: property.address?.barrio?.slug || property.address?.barrio || "",

    
    street: property.address?.street || "",
    number: property.address?.number || "",
    zipCode: property.address?.zipCode || "",

    // Precio
    priceAmount: property.price?.amount || 0,
    currency: property.price?.currency || "USD",

    // Location
    mapsUrl: property.location?.mapsUrl || "",
    lat: property.location?.lat || 0,
    lng: property.location?.lng || 0,

    // Características
    bedrooms: property.features?.bedrooms || 0,
    bathrooms: property.features?.bathrooms || 0,
    rooms: property.features?.rooms || 0,
    totalM2: property.features?.totalM2 || 0,
    coveredM2: property.features?.coveredM2 || 0,
    garage: !!property.features?.garage,
    age: property.antiguedad || 0,

    // Flags
    featured: !!property.flags?.featured,
    opportunity: !!property.flags?.opportunity,
    premium: !!property.flags?.premium,

    // Extras
    description: property.description || "",
    tags: property.tags ?? [],
    images: (property.images || []).map((img: any) =>
      typeof img === "string" ? img : img.url,
    ),

    status: property.status || "active",
  };
}
