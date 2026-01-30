// domain/types/Property.types.ts
import { Types } from "mongoose";

/**
 * Representa la propiedad tal cual vive en MongoDB (con IDs).
 * Se usa para el Schema y operaciones de escritura.
 */
export interface IProperty {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  operationType: "venta" | "alquiler";
  propertyType: Types.ObjectId; // Referencia a PropertyType
  zone: Types.ObjectId;         // Referencia a Zone
  price: {
    amount: number;
    currency: "USD" | "ARS";
  };
  address: {
    street: string;
    number: string;
    zipCode: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    totalM2: number;
    coveredM2: number;
    rooms: number;
    garage: boolean;
  };
  flags: {
    featured: boolean;
    opportunity: boolean;
    premium: boolean;
  };
  tags: string[];
  images: string[];
  description: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Representa la propiedad después del .populate()
 *
 */
export interface Property extends Omit<IProperty, "propertyType" | "zone" | "_id"> {
  id: string; // El id transformado de _id a string
  propertyType: {
    _id: string;
    name: string;
    slug: string;
  };
  zone: {
    _id: string;
    name: string;
    slug: string;
  };
}