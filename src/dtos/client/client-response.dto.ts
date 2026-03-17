/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { ClientSource } from "@/domain/enums/client-source.enum";

/**
 * Features de terreno/loteo en respuesta
 */
export interface TerrenoFeaturesResponse {
  mtsFrente?: number;
  mtsFondo?: number;
  mtsTotales?: number;
}

/**
 * Features de casa en respuesta
 */
export interface CasaFeaturesResponse {
  bedrooms?: number;
  bathrooms?: number;
  mtsCubiertos?: number;
  mtsTotales?: number;
  garage?: boolean;
  garageCount?: number;
  piso?: number;
  antiguedad?: number;
  estado?: "nuevo" | "usado" | "a_refaccionar";
}

/**
 * Features de departamento en respuesta
 */
export interface DeptoFeaturesResponse {
  bedrooms?: number;
  bathrooms?: number;
  mtsCubiertos?: number;
  mtsTotales?: number;
  garage?: boolean;
  garageCount?: number;
  piso?: number;
  antiguedad?: number;
  estado?: "nuevo" | "usado" | "a_refaccionar";
  amenities?: string[];
}

/**
 * Zona de preferencia en respuesta
 */
export interface ZoneResponse {
  province: {
    id: string;
    name: string;
    slug: string;
  } | null;
  provinceName?: string;
  city: {
    id: string;
    name: string;
    slug: string;
  } | null;
  cityName?: string;
  barrio: string | null;
}

/**
 * Preferencia de un tipo de propiedad en respuesta
 */
export interface PropertyPreferenceResponse {
  propertyType: "terreno" | "casa" | "loteo" | "depto";
  zones: ZoneResponse[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  features?: TerrenoFeaturesResponse | CasaFeaturesResponse | DeptoFeaturesResponse;
  notes?: string;
}

export interface ClientResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
  source: ClientSource;

  // Ubicación del cliente
  location?: {
    province?: string;
    city?: string;
    barrio?: string;
  };

  preferences: {
    operationType: string;
    propertyPreferences: PropertyPreferenceResponse[];
  };

  saleProperty?: {
    propertyType?: "terreno" | "casa" | "loteo" | "depto";
    address?: string;
    googleMapsUrl?: string;
    price?: number;
    description?: string;
    features?: TerrenoFeaturesResponse | CasaFeaturesResponse | DeptoFeaturesResponse;
    zones?: ZoneResponse[];
    notes?: string;
  };

  notes: string;
  assignedTo?: {
    id: string;
    name: string;
  };

  // Usuario que creó el cliente
  createdBy?: {
    userId: string;
    email: string;
  };

  interactions: {
    date: Date;
    type: string;
    description: string;
    performedBy?: {
      id: string;
      name: string;
    };
  }[];

  matches: {
    property: {
      id: string;
      title: string;
      slug: string;
    };
    score: number;
    matchedAt: Date;
    status: string;
    notes?: string;
  }[];

  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Normaliza la información de una ubicación (province/city)
 */
function normalizeLocation(location: any): { id: string; name: string; slug: string } | null {
  if (!location) return null;
  return {
    id: location._id?.toString() || location.toString(),
    name: location.name || "",
    slug: location.slug || "",
  };
}

/**
 * Normaliza una zona de preferencia
 */
function normalizeZone(zone: any): ZoneResponse {
  // Si hay nombres guardados directamente (cuando no se encontró en DB)
  if (zone?.provinceName || zone?.cityName) {
    return {
      province: zone.province 
        ? normalizeLocation(zone.province) 
        : (zone.provinceName ? { id: "", name: zone.provinceName, slug: "" } : null),
      provinceName: zone.provinceName,
      city: zone.city 
        ? normalizeLocation(zone.city) 
        : (zone.cityName ? { id: "", name: zone.cityName, slug: "" } : null),
      cityName: zone.cityName,
      barrio: zone?.barrio || null,
    };
  }
  
  // Caso normal con populate
  return {
    province: normalizeLocation(zone?.province),
    city: normalizeLocation(zone?.city),
    barrio: zone?.barrio || null,
  };
}

export function clientResponseDTO(client: any): ClientResponse {
  const idVal = client._id?.toString?.() ?? client.id ?? "";

  // Normalizar propertyPreferences
  const propertyPreferences: PropertyPreferenceResponse[] = (client.preferences?.propertyPreferences || []).map((pref: any) => {
    // Normalizar zonas
    const zones = (pref.zones || []).map(normalizeZone);

    // Normalizar priceRange
    const priceRange = pref.priceRange ? {
      min: pref.priceRange.min,
      max: pref.priceRange.max,
    } : undefined;

    // Features ya vienen con la estructura correcta del DTO, solo los pasamos
    const features = pref.features;

    return {
      propertyType: pref.propertyType || "casa",
      zones,
      priceRange,
      features,
      notes: pref.notes,
    };
  });

    // Ubicación del cliente - igual que normalizeZone
    const clientLocation = client.location;
    let locationResult: { province?: string; city?: string; barrio?: string; } | undefined;
    
    if (clientLocation) {
      // Si hay nombres guardados directamente, usarlos
      if (clientLocation.provinceName || clientLocation.cityName) {
        locationResult = {
          province: clientLocation.provinceName || clientLocation.province,
          city: clientLocation.cityName || clientLocation.city,
          barrio: clientLocation.barrio,
        };
      } else {
        // Si son ObjectIds poblados o strings simples
        locationResult = {
          province: clientLocation.province?.name || clientLocation.province,
          city: clientLocation.city?.name || clientLocation.city,
          barrio: clientLocation.barrio,
        };
      }
    }

    return {
      id: idVal,
      name: client.name,
      email: client.email,
      phone: client.phone,
      status: client.status,
      source: client.source,

      // Ubicación del cliente
      location: locationResult,

      preferences: {
      operationType: client.preferences?.operationType || "compra",
      propertyPreferences,
    },

    saleProperty: client.saleProperty ? {
      propertyType: client.saleProperty.propertyType,
      address: client.saleProperty.address,
      googleMapsUrl: client.saleProperty.googleMapsUrl,
      price: client.saleProperty.price,
      description: client.saleProperty.description,
      features: client.saleProperty.features,
      zones: client.saleProperty.zones?.map(normalizeZone),
      notes: client.saleProperty.notes,
    } : undefined,

    notes: client.notes || "",
    assignedTo: client.assignedTo
      ? {
          id: client.assignedTo._id?.toString() || client.assignedTo.toString(),
          name: client.assignedTo.name || "",
        }
      : undefined,

    // Usuario que creó el cliente
    createdBy: client.createdBy ? {
      userId: client.createdBy.userId?.toString() || "",
      email: client.createdBy.email || "",
    } : undefined,

    interactions: (client.interactions || []).map((interaction: any) => ({
      date: interaction.date,
      type: interaction.type,
      description: interaction.description,
      performedBy: interaction.performedBy
        ? {
            id: interaction.performedBy._id?.toString() || interaction.performedBy.toString(),
            name: interaction.performedBy.name || "",
          }
        : undefined,
    })),

    matches: (client.matches || []).map((match: any) => ({
      property: {
        id: match.property._id?.toString() || match.property.toString(),
        title: match.property.title || "",
        slug: match.property.slug || "",
      },
      score: match.score,
      matchedAt: match.matchedAt,
      status: match.status,
      notes: match.notes,
    })),

    lastActivityAt: client.lastActivityAt,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  };
}
