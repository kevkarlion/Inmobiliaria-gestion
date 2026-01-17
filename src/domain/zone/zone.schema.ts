import { Schema, model, models } from 'mongoose'

const ZoneSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export const ZoneModel =
  models.Zone || model('Zone', ZoneSchema)
