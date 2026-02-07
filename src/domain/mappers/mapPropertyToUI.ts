/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyUI } from "@/domain/types/PropertyUI.types";

function normalizeOperation(value: string): "venta" | "alquiler" {
  return (value === "venta" || value === "alquiler") ? value : "venta";
}

export function mapPropertyToUI(property: any): PropertyUI {
  
  // 1. Limpieza de URL de Maps para Iframe
  const rawUrl = property.location?.mapsUrl || "";
  let cleanEmbedUrl = rawUrl;
  if (rawUrl.includes("<iframe")) {
    const match = rawUrl.match(/src="([^"]+)"/);
    cleanEmbedUrl = match ? match[1] : rawUrl;
  }

  // 2. URL Externa para botón
  const street = property.address?.street || "";
  const number = property.address?.number || "";
  const city = property.address?.city?.name || "";
  const externalSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${street} ${number} ${city}`)}`;

  return {
    id: property._id?.toString() || property.id, 
    title: property.title || "Sin título",
    slug: property.slug || "",
    operationType: normalizeOperation(property.operationType),
    
    // Categoría
    typeSlug: property.propertyType?.slug || "",
    typeName: property.propertyType?.name || "Propiedad",

    // 📍 UBICACIÓN (Basado en tu console.log)
    provinceSlug: property.address?.province?.slug || "",
    provinceName: property.address?.province?.name || "",
    citySlug: property.address?.city?.slug || "",
    cityName: property.address?.city?.name || "",
    
    // Nombre combinado para mostrar en la card (ej: "General Roca, Río Negro")
    zoneName: property.address?.city?.name 
      ? `${property.address.city.name}, ${property.address.province?.name || ""}`
      : "Consultar ubicación",

    // Dirección
    street: street,
    number: number,
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
    age: property.age || 0,

    // Flags
    featured: !!property.flags?.featured,
    opportunity: !!property.flags?.opportunity,
    premium: !!property.flags?.premium,

    // Metadata
    tags: property.tags || [],
    images: (property.images || [])
  .slice(0, 1)
  .map((img: any) => img.url),


    status: property.status || "active",
    description: property.description || "",

    // Ubicación
    mapsUrl: cleanEmbedUrl,
    externalMapsUrl: externalSearchUrl,
    lat: property.location?.lat || 0,
    lng: property.location?.lng || 0,
  };
}