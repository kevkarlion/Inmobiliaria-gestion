import { Schema, model, models } from "mongoose";
import { IRequirement } from "@/domain/interfaces/requirement.interface";
import { RequirementStatus } from "@/domain/enums/requirement-status.enum";

const RequirementSchema = new Schema<IRequirement>(
  {
    // Referencia al cliente
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    // Tipo de operación: venta o alquiler
    operationType: {
      type: String,
      enum: ["venta", "alquiler"],
      required: true,
      index: true,
    },

    // Tipos de propiedad requeridos
    propertyTypes: [
      {
        type: Schema.Types.ObjectId,
        ref: "PropertyType",
      },
    ],

    // Zonas requeridas
    zones: [
      {
        province: { type: Schema.Types.ObjectId, ref: "Province" },
        city: { type: Schema.Types.ObjectId, ref: "City" },
        barrio: { type: String },
      },
    ],

    // Rango de precio
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number },
    },

    // Características requeridas
    features: {
      bedrooms: { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      minM2: { type: Number, default: 0 },
      garage: { type: Boolean },
    },

    // Estado del requirement
    status: {
      type: String,
      enum: Object.values(RequirementStatus),
      default: RequirementStatus.ACTIVE,
      index: true,
    },

    // Prioridad
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Notas adicionales
    notes: {
      type: String,
      default: "",
    },

    // Fecha de expiración (opcional)
    expiresAt: {
      type: Date,
    },

    // Propiedades que ya coincidieron
    matchedProperties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices para optimizar queries
RequirementSchema.index({ clientId: 1, status: 1 });
RequirementSchema.index({ operationType: 1, status: 1 });
RequirementSchema.index({ "zones.city": 1 });
RequirementSchema.index({ "priceRange.min": 1, "priceRange.max": 1 });
RequirementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RequirementModel =
  models.Requirement || model<IRequirement>("Requirement", RequirementSchema);
