import mongoose, { Schema, Document } from 'mongoose';

export interface IProvince extends Document {
  name: string;
  slug: string;
}

const ProvinceSchema = new Schema<IProvince>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }
}, { timestamps: true });

export const Province = mongoose.models.Province || mongoose.model<IProvince>('Province', ProvinceSchema);