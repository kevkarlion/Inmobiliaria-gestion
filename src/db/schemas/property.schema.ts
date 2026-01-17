import { Schema, model, models } from "mongoose";
import { OperationType } from "@/domain/enums/operation-type.enum";
import { PropertyStatus } from "@/domain/enums/property-status.enum";

const PropertySchema = new Schema(
  {
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
    },

    zone: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
    },

    price: {
      amount: { type: Number, required: true, index: true },
      currency: { type: String, required: true },
    },

    features: {
      bedrooms: Number,
      bathrooms: Number,
      m2: Number,
      garage: Boolean,
    },

    flags: {
      featured: { type: Boolean, default: false },
      opportunity: { type: Boolean, default: false },
      premium: { type: Boolean, default: false },
    },

    images: [String],

    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      default: PropertyStatus.ACTIVE,
      index: true,
    },
  },
  { timestamps: true }
);

export const PropertyModel =
  models.Property || model("Property", PropertySchema);
