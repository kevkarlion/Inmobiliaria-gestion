/* eslint-disable @typescript-eslint/no-explicit-any */
// src/dtos/property/property-response.dto.ts
import { Property } from "@/domain/types/Property.types";

/**
 * Nodo simple para entidades pobladas (province, city, barrio)
 */
export type AddressNode = {
  id: string;
  name: string;
  slug: string;
};

/**
 * Shape del objeto que viaja a UI / API
 * (solo datos planos, serializables)
 */
export interface PropertyResponse {
  id: string;
  title: string;
  slug: string;

  price: {
    amount: number;
    currency: string;
  };

  propertyType: {
    id: string;
    name: string;
    slug: string;
  };

  operationType: string;

  address: {
    street: string;
    number: string;
    zipCode: string;
    province: AddressNode | null;
    city: AddressNode | null;
    barrio: AddressNode | null;
  };

  features: Property["features"];
  flags: Property["flags"];

  tags: string[];
  images: {
    id?: string;
    url: string;
  }[];

  description?: string;
  status?: string;

  location: {
    mapsUrl: string;
    lat: number;
    lng: number;
  };

  antiguedad?: number;
}

/**
 * Factory (reemplaza a la clase)
 * Convierte Property (DB) → PropertyResponse (plano)
 */
export function propertyResponseDTO(property: Property): PropertyResponse {
  return {
    id: property._id.toString(),
    title: property.title,
    slug: property.slug,

    price: {
      amount: property.price.amount,
      currency: property.price.currency,
    },

    propertyType: {
      id: property.propertyType._id.toString(),
      name: property.propertyType.name,
      slug: property.propertyType.slug,
    },

    operationType: property.operationType,

    address: {
      street: property.address.street,
      number: property.address.number,
      zipCode: property.address.zipCode,

      province: property.address.province
        ? {
            id: property.address.province._id.toString(),
            name: property.address.province.name,
            slug: property.address.province.slug,
          }
        : null,

      city: property.address.city
        ? {
            id: property.address.city._id.toString(),
            name: property.address.city.name,
            slug: property.address.city.slug,
          }
        : null,

      barrio: property.address.barrio
        ? {
            id: property.address.barrio._id.toString(),
            name: property.address.barrio.name,
            slug: property.address.barrio.slug,
          }
        : null,
    },

    features: property.features,
    flags: property.flags,

    tags: property.tags || [],
    images: (property.images || []).map((img: any) => ({
      id: img._id?.toString(),
      url: typeof img === "string" ? img : img.url,
    })),

    description: property.description,
    status: property.status,

    location: {
      mapsUrl: property.location?.mapsUrl || "",
      lat: property.location?.lat || 0,
      lng: property.location?.lng || 0,
    },

    antiguedad: property.antiguedad,
  };
}
