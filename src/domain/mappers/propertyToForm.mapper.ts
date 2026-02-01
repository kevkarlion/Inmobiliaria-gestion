// mappers/propertyToForm.mapper.ts
import { PropertyResponseDTO } from "@/dtos/property/property-response.dto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPropertyToForm(property: PropertyResponseDTO): any {
  return {
    // Datos básicos
    title: property.title,
    slug: property.slug,
    operationType: property.operationType === "alquiler" ? "alquiler" : "venta",
    propertyTypeSlug: property.propertyType?.slug || "casa",

    // Ubicación (Aplanado para el select/input)
    province: property.address?.province?._id || property.address?.province || "", 
    city: property.address?.city?._id || property.address?.city || "",
    barrio: property.address?.barrio?._id || property.address?.barrio || "", 
    street: property.address?.street || "",
    number: property.address?.number || "",
    zipCode: property.address?.zipCode || "",

    // Precio (Aplanado)
    priceAmount: property.price?.amount || 0,
    currency: property.price?.currency || "USD",

    // Location / Mapa (Aplanado)
    mapsUrl: property.location?.mapsUrl || "",
    lat: property.location?.lat || 0,
    lng: property.location?.lng || 0,

    // Características (Aplanado)
    bedrooms: property.features?.bedrooms || 0,
    bathrooms: property.features?.bathrooms || 0,
    rooms: property.features?.rooms || 0,
    totalM2: property.features?.totalM2 || 0,
    coveredM2: property.features?.coveredM2 || 0,
    garage: !!property.features?.garage,
    age: property.age || 0,

    // Flags (Aplanado)
    featured: !!property.flags?.featured,
    opportunity: !!property.flags?.opportunity,
    premium: !!property.flags?.premium,

    // Extras
    description: property.description || "",
    tags: property.tags ?? [],
    images: property.images ?? [],
    status: property.status || "active",
  };
}