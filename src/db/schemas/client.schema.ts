import { Schema, model, models } from "mongoose";
import { IClient, ITerrenoFeatures, ICasaFeatures, IDeptoFeatures } from "@/domain/interfaces/client.interface";
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { ClientSource } from "@/domain/enums/client-source.enum";
import { ClientPropertyType } from "@/domain/enums/client-property-type.enum";

/**
 * Schema para features de terreno/loteo
 */
const TerrenoFeaturesSchema = new Schema<ITerrenoFeatures>(
  {
    mtsFrente: { type: Number },
    mtsFondo: { type: Number },
    mtsTotales: { type: Number },
  },
  { _id: false }
);

/**
 * Schema para features de casa
 */
const CasaFeaturesSchema = new Schema<ICasaFeatures>(
  {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    mtsCubiertos: { type: Number },
    mtsTotales: { type: Number },
    garage: { type: Boolean },
    garageCount: { type: Number },
    piso: { type: Number },
    antiguedad: { type: Number },
    estado: { type: String, enum: ["nuevo", "usado", "a_refaccionar"] },
  },
  { _id: false }
);

/**
 * Schema para features de departamento
 */
const DeptoFeaturesSchema = new Schema<IDeptoFeatures>(
  {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    mtsCubiertos: { type: Number },
    mtsTotales: { type: Number },
    garage: { type: Boolean },
    garageCount: { type: Number },
    piso: { type: Number },
    antiguedad: { type: Number },
    estado: { type: String, enum: ["nuevo", "usado", "a_refaccionar"] },
    amenities: { type: [String] },
  },
  { _id: false }
);

/**
 * Schema para zona de preferencia - acepta strings directamente (sin ObjectId)
 */
const ClientZoneSchema = new Schema(
  {
    province: { type: String, default: "" },
    provinceName: { type: String, default: "" },
    city: { type: String, default: "" },
    cityName: { type: String, default: "" },
    barrio: { type: String, default: "" },
  },
  { _id: false }
);

/**
 * Schema para preferencia de un tipo de propiedad específico
 */
const ClientPropertyPreferenceSchema = new Schema(
  {
    propertyType: {
      type: String,
      enum: Object.values(ClientPropertyType),
      required: true,
    },
    zones: [ClientZoneSchema],
    priceRange: {
      min: { type: Number },
      max: { type: Number },
    },
    features: {
      type: Schema.Types.Mixed,
    },
    notes: { type: String },
  },
  { _id: false }
);

const ClientSchema = new Schema<IClient>(
  {
    // Información personal
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // Estado del cliente
    status: {
      type: String,
      enum: Object.values(ClientStatus),
      default: ClientStatus.ACTIVE,
      index: true,
    },

    // Origen del cliente
    source: {
      type: String,
      enum: Object.values(ClientSource),
      default: ClientSource.WEB,
    },

    // Ubicación del cliente
    location: {
      province: { type: String, default: "" },
      city: { type: String, default: "" },
      barrio: { type: String, default: "" },
    },

    // Preferencias del cliente
    preferences: {
      // Tipo de operación: venta, alquiler o compra
      operationType: {
        type: String,
        enum: ["venta", "alquiler", "compra"],
        required: true,
        index: true,
      },
      // Array de preferencias por tipo de propiedad
      propertyPreferences: [ClientPropertyPreferenceSchema],
    },

    // Información de propiedad que vende (cuando operationType = "venta")
    saleProperty: {
      propertyType: { type: String, enum: ["terreno", "casa", "loteo", "depto"] },
      address: { type: String, default: "" },
      googleMapsUrl: { type: String, default: "" },
      price: { type: Number },
      description: { type: String, default: "" },
      features: { type: Schema.Types.Mixed },
      zones: [ClientZoneSchema],
      notes: { type: String, default: "" },
    },

    // Notas adicionales del cliente
    notes: {
      type: String,
      default: "",
    },

    // Asignación a agente
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // Historial de interacciones
    interactions: [
      {
        date: { type: Date, default: Date.now },
        type: {
          type: String,
          enum: ["llamada", "whatsapp", "email", "reunion", "visita", "nota"],
        },
        description: String,
        performedBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],

    // Resultados de matching (propiedades sugeridas)
    matches: [
      {
        property: { type: Schema.Types.ObjectId, ref: "Property" },
        score: { type: Number },
        matchedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["nuevo", "contactado", "interesado", "no_interesado"],
          default: "nuevo",
        },
        notes: String,
      },
    ],

    // Fecha de última actividad
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices para optimizar queries
ClientSchema.index({ "preferences.operationType": 1, status: 1 });
ClientSchema.index({ "preferences.propertyPreferences.propertyType": 1 });

export const ClientModel =
  models.Client || model<IClient>("Client", ClientSchema);
