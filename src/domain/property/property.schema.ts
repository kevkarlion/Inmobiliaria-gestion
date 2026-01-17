import { Schema, model, models } from 'mongoose'

const PropertySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    operationType: {
      type: String,
      enum: ['venta', 'alquiler'],
      required: true
    },

    propertyType: {
      type: Schema.Types.ObjectId,
      ref: 'PropertyType',
      required: true
    },

    zone: {
      type: Schema.Types.ObjectId,
      ref: 'Zone',
      required: true
    },

    price: {
      amount: Number,
      currency: { type: String, enum: ['USD', 'ARS'] }
    },

    features: {
      bedrooms: Number,
      bathrooms: Number,
      m2: Number
    },

    flags: {
      featured: { type: Boolean, default: false },
      opportunity: { type: Boolean, default: false },
      premium: { type: Boolean, default: false }
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true }
)

export const PropertyModel =
  models.Property || model('Property', PropertySchema)
