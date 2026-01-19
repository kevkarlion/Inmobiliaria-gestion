import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    operationType: {
      type: String,
      enum: ["venta", "alquiler"],
      required: true,
    },

    propertyType: {
      type: Schema.Types.ObjectId,
      ref: "PropertyType",
      required: true,
    },

    zone: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
    },

    description: {
      type: String,
    },

    address: {
      street: String,
      number: String,
      zipCode: String,
    },

    price: {
      amount: { type: Number, required: true },
      currency: {
        type: String,
        enum: ["USD", "ARS"],
        required: true,
      },
    },

    features: {
      bedrooms: Number,
      bathrooms: Number,
      totalM2: Number,
      coveredM2: Number,
      rooms: Number,
      garage: Boolean,
    },

    age: Number,

    tags: [String],

    flags: {
      featured: { type: Boolean, default: false },
      opportunity: { type: Boolean, default: false },
      premium: { type: Boolean, default: false },
    },

    images: [String],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const PropertyModel =
  models.Property || model("Property", PropertySchema);
