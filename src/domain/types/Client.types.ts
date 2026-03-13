// domain/types/Client.types.ts

/**
 * Tipos relacionados con el cliente para UI y DTOs
 */

/**
 * Zona de preferencia del cliente
 */
export interface ClientZonePreference {
  province?: string;
  city?: string;
  barrio?: string;
}

/**
 * Rango de precio preferido
 */
export interface ClientPriceRange {
  min: number;
  max?: number;
}

/**
 * Características preferidas en una propiedad
 */
export interface ClientFeaturesPreference {
  bedrooms: number;
  bathrooms: number;
  minM2: number;
  garage?: boolean;
}

/**
 * Preferencias del cliente para matching
 */
export interface ClientPreferences {
  operationType: "venta" | "alquiler";
  propertyTypes: string[];
  zones: ClientZonePreference[];
  priceRange: ClientPriceRange;
  features: ClientFeaturesPreference;
}

/**
 * Tipo de interacción con el cliente
 */
export type InteractionType = "llamada" | "whatsapp" | "email" | "reunion" | "visita" | "nota";

/**
 * Interacción registrada con el cliente
 */
export interface ClientInteraction {
  date: Date;
  type: InteractionType;
  description: string;
  performedBy?: string;
}

/**
 * Estado de un match (sugerencia de propiedad)
 */
export type MatchStatus = "nuevo" | "contactado" | "interesado" | "no_interesado";

/**
 * Match recomendado para el cliente
 */
export interface ClientMatch {
  property: string;
  score: number;
  matchedAt: Date;
  status: MatchStatus;
  notes?: string;
}

/**
 * Cliente formateado para UI (después de populate)
 */
export interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "converted" | "lost";
  source: "web" | "referido" | "publicado" | "oficina" | "otro";
  preferences: ClientPreferences;
  notes: string;
  assignedTo?: string;
  interactions: ClientInteraction[];
  matches: ClientMatch[];
  lastActivityAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Formato de respuesta para listados paginados de clientes
 */
export interface FindAllClientsResult {
  items: Client[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Breakdown del score de matching
 */
export interface MatchScoreBreakdown {
  zone: number;
  propertyType: number;
  price: number;
}

/**
 * Resultado de matching con detalle
 */
export interface MatchResult {
  propertyId: string;
  score: number;
  breakdown: MatchScoreBreakdown;
}
