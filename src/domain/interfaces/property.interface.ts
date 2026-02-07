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
  propertyType: Types.ObjectId;

  price: {
    amount: number;
    currency: "USD" | "ARS";
  };
  address: {
    street: string;
    number: string;
    zipCode: string;
    // 🔹 Nuevas referencias obligatorias/opcionales
    province: Types.ObjectId;
    city: Types.ObjectId;
    barrio?: Types.ObjectId;
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
  images: { url: string; alt?: string }[];


  location: {
    mapsUrl: string;
    lat: number;
    lng: number;
  };

  description: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
  age: number;
}

/**
 * Representa la entidad de dominio después del .populate()
 * Se usa en los Servicios y Mappers.
 */
export interface Property extends Omit<
  IProperty,
  "propertyType" | "address" | "_id"
> {
  id: string;
  propertyType: {
    _id: string;
    name: string;
    slug: string;
  };
  // 🔹 Address transformado con objetos poblados
  address: {
    street: string;
    number: string;
    zipCode: string;
    province: {
      _id: string;
      name: string;
      slug: string;
    };
    city: {
      _id: string;
      name: string;
      slug: string;
    };
    barrio?: {
      _id: string;
      name: string;
      slug: string;
    };
  };
}
