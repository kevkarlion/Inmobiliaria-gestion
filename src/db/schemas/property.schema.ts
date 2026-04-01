import { Schema, model, models } from "mongoose";
import { IProperty } from "@/domain/interfaces/property.interface"; // Tu interfaz
import { OperationType } from "@/domain/enums/operation-type.enum";
import { PropertyStatus } from "@/domain/enums/property-status.enum";

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },

    operationType: {
      type: String,
      enum: Object.values(OperationType),
      required: true,
      index: true,
    },

    propertyType: {
      type: Schema.Types.ObjectId,
      ref: "PropertyType",
      required: true,
      index: true,
    },
    // 👇 NUEVO CAMPO: contactPhone
    contactPhone: {
      type: String,
      trim: true,
      default: "",
    },

    description: { type: String, trim: true },

    address: {
      street: { type: String },
      number: { type: String },
      zipCode: { type: String },

      // Relaciones territoriales
      province: {
        type: Schema.Types.ObjectId,
        ref: "Province",
        required: true,
      },
      city: { type: Schema.Types.ObjectId, ref: "City", required: true },
      barrio: { type: String }, // 👈 Ahora se llama barrio
    },

    price: {
      amount: { type: Number, required: true, index: true },
      currency: {
        type: String,
        enum: ["ARS", "USD"],
        required: true,
      },
      priceOption: {
        type: String,
        enum: ["amount", "consult"],
        default: "amount",
      },
    },

    features: {
      bedrooms: { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      totalM2: { type: Number, default: 0 },
      coveredM2: { type: Number, default: 0 },
      rooms: { type: Number, default: 0 },
      garage: { type: Boolean, default: false },
      garageType: { 
        type: String, 
        enum: ["cochera", "entrada", "ninguno"], 
        default: "ninguno" 
      },
      width: { type: Number, default: 0 },
      length: { type: Number, default: 0 },
      age: { type: Number, default: 0 },
      services: { 
        type: [String], 
        enum: ["luz", "agua", "gas", "internet", "cloacas", "cordon-cuneta"], 
        default: [] 
      },
    },

    location: {
      mapsUrl: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },

    tags: { type: [String], index: true },

    flags: {
      featured: { type: Boolean, default: false, index: true },
      opportunity: { type: Boolean, default: false, index: true },
      premium: { type: Boolean, default: false, index: true },
    },

    images: {
      type: [String], // Array de strings
      default: [],
    },

    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      default: PropertyStatus.ACTIVE,
      index: true,
    },

    // Usuario que creó la propiedad
    createdBy: {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      email: { type: String },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Solo una exportación para toda la app
export const PropertyModel =
  models.Property || model<IProperty>("Property", PropertySchema);
