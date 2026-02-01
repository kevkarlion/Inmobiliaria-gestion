import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
  slug: string;
  province: mongoose.Types.ObjectId;
}

const CitySchema = new Schema<ICity>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  province: { type: Schema.Types.ObjectId, ref: 'Province', required: true }
}, { timestamps: true });

// Esto evita que existan dos ciudades con el mismo slug en la misma provincia
CitySchema.index({ slug: 1, province: 1 }, { unique: true });

export const City = mongoose.models.City || mongoose.model<ICity>('City', CitySchema);