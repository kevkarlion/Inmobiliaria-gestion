/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyUI } from "@/domain/types/PropertyUI.types";

function normalizeOperation(value: string): "venta" | "alquiler" {
  return (value === "venta" || value === "alquiler") ? value : "venta";
}

export function mapPropertyToUI(property: any): PropertyUI {
  

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

  // Variables de dirección para fallback
  const street = property.address?.street || "";
  const number = property.address?.number || "";
  const city = property.address?.city?.name || "";

  // 3. Extraer coordenadas del iframe de Google Maps para URL externa
  // El iframe tiene formato: ...!2d{LONG}!3d{LAT}...
  const embedUrl = cleanEmbedUrl;
  const lngMatch = embedUrl.match(/!2d(-?[\d.]+)/);
  const latMatch = embedUrl.match(/!3d(-?[\d.]+)/);
  
  const lat = latMatch ? latMatch[1] : null;
  const lng = lngMatch ? lngMatch[1] : null;
  
  let externalSearchUrl: string;
  
  if (lat && lng) {
    // Usar formato "place" más compatible con mobile (iOS/Android)
    // Formato: https://www.google.com/maps/@LAT,LNG,z15
    externalSearchUrl = `https://www.google.com/maps/@${lat},${lng},17z?entry=ttu`;
  } else {
    // Fallback a búsqueda por texto
    externalSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${street} ${number} ${city}`)}`;
  }

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
    priceOption: property.price?.priceOption || "amount",

    // Medidas
    bedrooms: property.features?.bedrooms || 0,
    bathrooms: property.features?.bathrooms || 0,
    totalM2: property.features?.totalM2 || 0,
    coveredM2: property.features?.coveredM2 || 0,
    rooms: property.features?.rooms || 0,
    garage: !!property.features?.garage,
    garageType: property.features?.garageType || "ninguno",
    width: property.features?.width || 0,
    length: property.features?.length || 0,
    age: property.features?.age || 0,
    services: property.features?.services || [],

    // Flags
    featured: !!property.flags?.featured,
    opportunity: !!property.flags?.opportunity,
    premium: !!property.flags?.premium,
    reserved: !!property.flags?.reserved,
    sold: !!property.flags?.sold,

    // Contenido
    tags: property.tags || [],
    images: Array.isArray(property.images) 
      ? property.images.map((img: any) => typeof img === "string" ? img : img.url)
      : [],
    imagesDesktop: Array.isArray(property.imagesDesktop) 
      ? property.imagesDesktop 
      : [],
    imagesMobile: Array.isArray(property.imagesMobile) 
      ? property.imagesMobile 
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