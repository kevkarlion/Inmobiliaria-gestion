/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { ClientSource } from "@/domain/enums/client-source.enum";
import { ClientPropertyType } from "@/domain/enums/client-property-type.enum";

/**
 * Features para terreno/loteo
 */
interface TerrenoFeaturesDTO {
  mtsFrente?: number;
  mtsFondo?: number;
  mtsTotales?: number;
}

/**
 * Features para casa
 */
interface CasaFeaturesDTO {
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
 * Features para departamento
 */
interface DeptoFeaturesDTO {
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
 * Zona de preferencia
 */
interface ZoneDTO {
  province?: string;
  city?: string;
  barrio?: string;
}

/**
 * Preferencia de un tipo de propiedad específico
 */
interface PropertyPreferenceDTO {
  propertyType: "terreno" | "casa" | "loteo" | "depto";
  zones?: ZoneDTO[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  features?: TerrenoFeaturesDTO | CasaFeaturesDTO | DeptoFeaturesDTO;
  notes?: string;
}

/**
 * Información de propiedad en venta
 */
interface SalePropertyDTO {
  propertyType?: "terreno" | "casa" | "loteo" | "depto";
  address?: string;
  googleMapsUrl?: string;
  price?: number;
  description?: string;
  features?: TerrenoFeaturesDTO | CasaFeaturesDTO | DeptoFeaturesDTO;
  zones?: ZoneDTO[];
  notes?: string;
}

export class CreateClientDTO {
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
    operationType: "venta" | "alquiler" | "compra";
    propertyPreferences: PropertyPreferenceDTO[];
  };

  saleProperty?: SalePropertyDTO;

  notes: string;
  assignedTo?: string;

  constructor(data: any) {
    // Validaciones de campos obligatorios
    if (!data.name || data.name.trim() === "") {
      throw new BadRequestError("El nombre es requerido");
    }
    if (!data.email || data.email.trim() === "") {
      throw new BadRequestError("El email es requerido");
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      throw new BadRequestError("El formato del email es inválido");
    }

    this.name = data.name?.trim() || "";
    this.email = data.email?.trim().toLowerCase() || "";
    
    // Normalizar status
    const statusInputRaw = (data.status ?? ClientStatus.ACTIVE).toString().toLowerCase();
    this.status = (Object.values(ClientStatus) as string[]).includes(statusInputRaw) 
      ? (statusInputRaw as ClientStatus) 
      : ClientStatus.ACTIVE;
    
    // Normalizar source
    const sourceInputRaw = (data.source ?? ClientSource.WEB).toString().toLowerCase();
    this.source = (Object.values(ClientSource) as string[]).includes(sourceInputRaw) 
      ? (sourceInputRaw as ClientSource) 
      : ClientSource.WEB;

    this.phone = data.phone?.trim() || "";
    this.notes = data.notes || "";
    this.assignedTo = data.assignedTo;

    // Procesar location
    if (data.location && typeof data.location === "object") {
      const loc = data.location;
      if (loc.province || loc.city || loc.barrio) {
        this.location = {
          province: loc.province?.trim() || undefined,
          city: loc.city?.trim() || undefined,
          barrio: loc.barrio?.trim() || undefined,
        };
      }
    }

    // Validar operationType
    const allowedOps = ["venta", "alquiler", "compra"] as const;
    const opTypeFromInput = (data.preferences?.operationType ?? "compra").toString().toLowerCase();
    const validatedOpType = allowedOps.includes(opTypeFromInput as typeof allowedOps[number])
      ? opTypeFromInput as "venta" | "alquiler" | "compra"
      : "compra";

    // Procesar propertyPreferences
    const propertyPreferences: PropertyPreferenceDTO[] = [];
    
    if (data.preferences?.propertyPreferences && Array.isArray(data.preferences.propertyPreferences)) {
      for (const pref of data.preferences.propertyPreferences) {
        const validatedPropertyType = this.validatePropertyType(pref.propertyType);
        
        if (validatedPropertyType) {
          propertyPreferences.push({
            propertyType: validatedPropertyType,
            zones: this.processZones(pref.zones),
            priceRange: this.processPriceRange(pref.priceRange),
            features: this.processFeatures(validatedPropertyType, pref.features),
            notes: pref.notes,
          });
        }
      }
    }

    this.preferences = {
      operationType: validatedOpType,
      propertyPreferences,
    };

    // Procesar saleProperty (si existe en el input)
    if (data.saleProperty && typeof data.saleProperty === "object") {
      const saleProp = data.saleProperty;
      this.saleProperty = {
        propertyType: saleProp.propertyType ? this.validatePropertyType(saleProp.propertyType) || undefined : undefined,
        address: saleProp.address?.trim() || undefined,
        googleMapsUrl: saleProp.googleMapsUrl?.trim() || undefined,
        price: saleProp.price ? Number(saleProp.price) : undefined,
        description: saleProp.description?.trim() || undefined,
        features: saleProp.features ? this.processFeatures(saleProp.propertyType || "casa", saleProp.features) : undefined,
        zones: saleProp.zones ? this.processZones(saleProp.zones) : undefined,
        notes: saleProp.notes?.trim() || undefined,
      };
    }
  }

  /**
   * Valida el tipo de propiedad contra los valores permitidos
   */
  private validatePropertyType(type?: string): PropertyPreferenceDTO["propertyType"] | null {
    const allowedTypes = ["terreno", "casa", "loteo", "depto"];
    if (!type) return null;
    const normalized = type.toLowerCase();
    return allowedTypes.includes(normalized) ? normalized as PropertyPreferenceDTO["propertyType"] : null;
  }

  /**
   * Procesa las zonas de preferencia
   */
  private processZones(zones?: ZoneDTO[]): ZoneDTO[] {
    if (!zones || !Array.isArray(zones)) return [];
    return zones
      .filter(zone => zone.province || zone.city || zone.barrio)
      .map(zone => ({
        province: zone.province?.trim(),
        city: zone.city?.trim(),
        barrio: zone.barrio?.trim(),
      }));
  }

  /**
   * Procesa el rango de precio
   */
  private processPriceRange(priceRange?: { min?: number; max?: number }): { min?: number; max?: number } | undefined {
    if (!priceRange) return undefined;
    const min = priceRange.min !== undefined ? Number(priceRange.min) : undefined;
    const max = priceRange.max !== undefined ? Number(priceRange.max) : undefined;
    if (min === undefined && max === undefined) return undefined;
    return { min, max };
  }

  /**
   * Procesa las features según el tipo de propiedad
   */
  private processFeatures(
    propertyType: PropertyPreferenceDTO["propertyType"],
    features?: any
  ): TerrenoFeaturesDTO | CasaFeaturesDTO | DeptoFeaturesDTO | undefined {
    if (!features) return undefined;

    if (propertyType === "terreno" || propertyType === "loteo") {
      return {
        mtsFrente: features.mtsFrente ? Number(features.mtsFrente) : undefined,
        mtsFondo: features.mtsFondo ? Number(features.mtsFondo) : undefined,
        mtsTotales: features.mtsTotales ? Number(features.mtsTotales) : undefined,
      };
    }

    if (propertyType === "casa") {
      return {
        bedrooms: features.bedrooms ? Number(features.bedrooms) : undefined,
        bathrooms: features.bathrooms ? Number(features.bathrooms) : undefined,
        mtsCubiertos: features.mtsCubiertos ? Number(features.mtsCubiertos) : undefined,
        mtsTotales: features.mtsTotales ? Number(features.mtsTotales) : undefined,
        garage: features.garage,
        garageCount: features.garageCount ? Number(features.garageCount) : undefined,
        piso: features.piso ? Number(features.piso) : undefined,
        antiguedad: features.antiguedad ? Number(features.antiguedad) : undefined,
        estado: features.estado,
      };
    }

    if (propertyType === "depto") {
      return {
        bedrooms: features.bedrooms ? Number(features.bedrooms) : undefined,
        bathrooms: features.bathrooms ? Number(features.bathrooms) : undefined,
        mtsCubiertos: features.mtsCubiertos ? Number(features.mtsCubiertos) : undefined,
        mtsTotales: features.mtsTotales ? Number(features.mtsTotales) : undefined,
        garage: features.garage,
        garageCount: features.garageCount ? Number(features.garageCount) : undefined,
        piso: features.piso ? Number(features.piso) : undefined,
        antiguedad: features.antiguedad ? Number(features.antiguedad) : undefined,
        estado: features.estado,
        amenities: features.amenities,
      };
    }

    return undefined;
  }
}
