/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { ClientSource } from "@/domain/enums/client-source.enum";

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

export class UpdateClientDTO {
  name?: string;
  email?: string | null;
  phone?: string;
  status?: ClientStatus;
  source?: ClientSource;

  // Ubicación del cliente
  location?: {
    province?: string;
    city?: string;
    barrio?: string;
  } | null;

  preferences?: {
    operationType?: "venta" | "alquiler" | "compra";
    propertyPreferences?: PropertyPreferenceDTO[];
  };

  saleProperty?: SalePropertyDTO | null;

  notes?: string;
  assignedTo?: string;

  constructor(data: any) {
    // Validar email si se proporciona
    if (data.email !== undefined && data.email !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("El formato del email es inválido");
      }
      this.email = data.email.trim().toLowerCase();
    } else if (data.email === "") {
      this.email = null;
    }

    this.name = data.name?.trim();
    this.phone = data.phone?.trim();
    this.status = data.status;
    this.source = data.source;
    this.notes = data.notes;
    this.assignedTo = data.assignedTo;

    // Procesar location
    if (data.location !== undefined) {
      if (data.location === null) {
        this.location = null;
      } else if (data.location && typeof data.location === "object") {
        if (data.location.province || data.location.city || data.location.barrio) {
          this.location = {
            province: data.location.province?.trim() || undefined,
            city: data.location.city?.trim() || undefined,
            barrio: data.location.barrio?.trim() || undefined,
          };
        }
      }
    }

    if (data.preferences !== undefined) {
      const prefs: UpdateClientDTO["preferences"] = {};

      // Validar operationType
      if (data.preferences.operationType !== undefined) {
        const allowedOps = ["venta", "alquiler", "compra"];
        const opType = data.preferences.operationType?.toString().toLowerCase();
        if (allowedOps.includes(opType)) {
          prefs.operationType = opType as "venta" | "alquiler" | "compra";
        }
      }

      // Procesar propertyPreferences
      if (data.preferences.propertyPreferences !== undefined) {
        const propertyPreferences: PropertyPreferenceDTO[] = [];
        
        if (Array.isArray(data.preferences.propertyPreferences)) {
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
        
        prefs.propertyPreferences = propertyPreferences;
      }

      this.preferences = prefs;
    }

    // Procesar saleProperty
    if (data.saleProperty !== undefined) {
      if (data.saleProperty === null) {
        this.saleProperty = null;
      } else if (data.saleProperty && typeof data.saleProperty === "object") {
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
  private processZones(zones?: ZoneDTO[]): ZoneDTO[] | undefined {
    if (!zones || !Array.isArray(zones)) return undefined;
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
