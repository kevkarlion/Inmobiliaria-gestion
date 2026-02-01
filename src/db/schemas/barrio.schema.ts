import mongoose, { Schema, Document } from 'mongoose';

export interface IBarrio extends Document {
  name: string;
  slug: string;
  city: mongoose.Types.ObjectId; // Sigue apuntando a City (Localidad)
}

const BarrioSchema = new Schema<IBarrio>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  city: { type: Schema.Types.ObjectId, ref: 'City', required: true }
}, { timestamps: true });

// Evita duplicados del mismo barrio en la misma ciudad
BarrioSchema.index({ slug: 1, city: 1 }, { unique: true });

export const Barrio = mongoose.models.Barrio || mongoose.model<IBarrio>('Barrio', BarrioSchema);