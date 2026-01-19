import { Schema, model, models } from "mongoose";
import { OperationType } from "@/domain/enums/operation-type.enum";
import { PropertyStatus } from "@/domain/enums/property-status.enum";

const PropertySchema = new Schema(
  {
    // 🔹 Core
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

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

    zone: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
      index: true,
    },

    // 📝 Contenido
    description: {
      type: String,
      trim: true,
    },

    address: {
      street: { type: String },
      number: { type: String },
      zipCode: { type: String },
    },

    // 💰 Precio
    price: {
      amount: { type: Number, required: true, index: true },
      currency: {
        type: String,
        enum: ["ARS", "USD"],
        required: true,
      },
    },

    // 🏠 Características
    features: {
      bedrooms: Number,
      bathrooms: Number,
      totalM2: Number,
      coveredM2: Number,
      rooms: Number,
      garage: Boolean,
    },

    age: Number,

    tags: {
      type: [String],
      index: true,
    },

    // 🚩 Flags comerciales
    flags: {
      featured: { type: Boolean, default: false, index: true },
      opportunity: { type: Boolean, default: false, index: true },
      premium: { type: Boolean, default: false, index: true },
    },

    images: {
      type: [String],
      default: [],
    },

    // 🔒 Estado
    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      default: PropertyStatus.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PropertyModel =
  models.Property || model("Property", PropertySchema);
