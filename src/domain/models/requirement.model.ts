/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model, models, Document } from "mongoose";

export interface RequirementDocument extends Document {
  clientId: any;
  zone: string;
  type: string;
  priceMin: number;
  priceMax: number;
  status?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RequirementSchema = new Schema<RequirementDocument>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    zone: { type: String, required: true },
    type: { type: String, required: true },
    priceMin: { type: Number, required: true },
    priceMax: { type: Number, required: true },
    status: { type: String, default: "open" },
    notes: { type: String }
  },
  { timestamps: true }
);

export const RequirementModel = models.Requirement || model<RequirementDocument>("Requirement", RequirementSchema);
