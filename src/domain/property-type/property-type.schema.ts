import { Schema, model, models } from "mongoose";

const PropertyTypeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "propertytypes",
  }
);

export const PropertyTypeModel =
  models.PropertyType || model("PropertyType", PropertyTypeSchema);
