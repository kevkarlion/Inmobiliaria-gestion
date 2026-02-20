/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyUI } from "@/domain/types/PropertyUI.types";

function normalizeOperation(value: string): "venta" | "alquiler" {
  return (value === "venta" || value === "alquiler") ? value : "venta";
}

export function mapPropertyToUI(property: any): PropertyUI {
  console.log('property mapper', property)

  // 1. Limpieza de URL de Maps
  const rawUrl = property.location?.mapsUrl || "";
  let cleanEmbedUrl = rawUrl;
  if (rawUrl.includes("<iframe")) {
    const match = rawUrl.match(/src="([^"]+)"/);
    cleanEmbedUrl = match ? match[1] : rawUrl;
  }

  // 2. Lógica para Barrio (Puede ser String u Objeto)
  const rawBarrio = property.address?.barrio;
  const barrioName = typeof rawBarrio === 'string' 
    ? rawBarrio 
    : (rawBarrio?.name || "");
    
  const barrioSlug = typeof rawBarrio === 'object' 
    ? rawBarrio?.slug || "" 
    : rawBarrio?.toLowerCase().replace(/\s+/g, '-') || "";

  // 3. URL externa Google Maps (Corregido el template string)
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

    // Ubicación
    provinceSlug: property.address?.province?.slug || "",
    provinceName: property.address?.province?.name || "",
    citySlug: property.address?.city?.slug || "",
    cityName: city,
    barrioSlug: barrioSlug,
    barrioName: barrioName,

    zoneName: city 
      ? `${city}${barrioName ? `, ${barrioName}` : ""}`
      : "Consultar ubicación",

    // Dirección
    street,
    number,
    zipCode: property.address?.zipCode || "",

    // Precio
    amount: property.price?.amount || 0,
    currency: property.price?.currency || "USD",

    // Medidas
    bedrooms: property.features?.bedrooms || 0,
    bathrooms: property.features?.bathrooms || 0,
    totalM2: property.features?.totalM2 || 0,
    coveredM2: property.features?.coveredM2 || 0,
    rooms: property.features?.rooms || 0,
    garage: !!property.features?.garage,
    age: property.features?.age || 0,

    // Flags
    featured: !!property.flags?.featured,
    opportunity: !!property.flags?.opportunity,
    premium: !!property.flags?.premium,

    // Contenido
    tags: property.tags || [],
    images: Array.isArray(property.images) 
      ? property.images.map((img: any) => typeof img === "string" ? img : img.url)
      : [],
    description: property.description || "",

    // Estado
    status: property.status || "active",

    // Contacto
    contactPhone: property.contactPhone || "",

    // Maps
    mapsUrl: cleanEmbedUrl,
    externalMapsUrl: externalSearchUrl,
    lat: property.location?.lat || 0,
    lng: property.location?.lng || 0,
  };
}