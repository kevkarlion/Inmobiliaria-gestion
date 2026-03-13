import { Document, Types } from "mongoose";
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { ClientSource } from "@/domain/enums/client-source.enum";
import { ClientPropertyType } from "@/domain/enums/client-property-type.enum";

/**
 * Características específicas para terrenos/loteos
 */
export interface ITerrenoFeatures {
  mtsFrente?: number;
  mtsFondo?: number;
  mtsTotales?: number;
}

/**
 * Características específicas para casas
 */
export interface ICasaFeatures {
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
 * Características específicas para departamentos
 */
export interface IDeptoFeatures {
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
 * Unión de todos los tipos de features según el tipo de propiedad
 */
export type IClientFeatures = 
  | ITerrenoFeatures 
  | ICasaFeatures 
  | IDeptoFeatures;

/**
 * Zona de preferencia con ubicación completa
 */
export interface IClientZone {
  province?: Types.ObjectId;
  provinceName?: string;
  city?: Types.ObjectId;
  cityName?: string;
  barrio?: string;
}

/**
 * Preferencia de un cliente para un tipo de propiedad específico
 */
export interface IClientPropertyPreference {
  propertyType: ClientPropertyType;
  zones: IClientZone[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  features?: IClientFeatures;
  notes?: string;
}

/**
 * Interfaz para el documento Client en MongoDB
 * Se usa para el Schema y operaciones de escritura
 */
export interface IClient extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
  source: ClientSource;

  // Ubicación del cliente (donde vive/se localiza)
  location?: {
    province?: string;
    city?: string;
    barrio?: string;
  };

  // Preferencias del cliente - ahora es un array para soportar múltiples tipos de propiedad
  preferences: {
    operationType: "venta" | "alquiler" | "compra";
    propertyPreferences: IClientPropertyPreference[];
  };

  // Información de propiedad que vende (cuando operationType = "venta")
  saleProperty?: {
    propertyType?: "terreno" | "casa" | "loteo" | "depto";
    address?: string;
    googleMapsUrl?: string;
    price?: number;
    description?: string;
    features?: IClientFeatures;
    zones?: IClientZone[];
    notes?: string;
  };

  // Notas adicionales del cliente
  notes: string;
  assignedTo?: Types.ObjectId;

  interactions: {
    date: Date;
    type: "llamada" | "whatsapp" | "email" | "reunion" | "visita" | "nota";
    description: string;
    performedBy?: Types.ObjectId;
  }[];

  matches: {
    property: Types.ObjectId;
    score: number;
    matchedAt: Date;
    status: "nuevo" | "contactado" | "interesado" | "no_interesado";
    notes?: string;
  }[];

  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
