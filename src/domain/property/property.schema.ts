// // db/property/property.schema.ts
// import { Schema, model, models } from "mongoose";
// import { IProperty } from "@/domain/interfaces/property.interface";

// const PropertySchema = new Schema<IProperty>(
//   {
//     title: { type: String, required: true },
//     // slug: { type: String, required: true, unique: true },
//     operationType: {
//       type: String,
//       enum: ["venta", "alquiler"],
//       required: true,
//     },
//     propertyType: {
//       type: Schema.Types.ObjectId,
//       ref: "PropertyType", // Debe coincidir con el nombre del modelo
//       required: true,
//     },
//     description: { type: String },
//     address: {
//       street: String,
//       number: String,
//       zipCode: String,
//     },
//     price: {
//       amount: { type: Number, required: true },
//       currency: {
//         type: String,
//         enum: ["USD", "ARS"],
//         required: true,
//       },
//     },
//     features: {
//       bedrooms: { type: Number, default: 0 },
//       bathrooms: { type: Number, default: 0 },
//       totalM2: { type: Number, default: 0 },
//       coveredM2: { type: Number, default: 0 },
//       rooms: { type: Number, default: 0 },
//       garage: { type: Boolean, default: false },
//     },
//     tags: [String],
//     flags: {
//       featured: { type: Boolean, default: false },
//       opportunity: { type: Boolean, default: false },
//       premium: { type: Boolean, default: false },
//     },
//     images: [String],
//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "active",
//     },
//     location: {
//       mapsUrl: { type: String },
//       lat: { type: Number },
//       lng: { type: Number },
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true }, // Para que convierta _id en id al enviarlo
//     toObject: { virtuals: true },
//   },
// );

// //El Modelo (PropertyModel) es la herramienta que usas para ejecutar comandos (find, create), pero la Interfaz (IProperty) es la que le da la "forma" a los resultados que esos comandos devuelven.
// export const PropertyModel =
//   models.Property || model<IProperty>("Property", PropertySchema);
