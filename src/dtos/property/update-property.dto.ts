/* eslint-disable @typescript-eslint/no-explicit-any */
// backend/dto/UpdatePropertyDTO.ts

export class UpdatePropertyDTO {
  title?: string;
  slug?: string;
  operationType?: "venta" | "alquiler";
  propertyTypeSlug?: string;
  description?: string;
  age?: number;
  tags?: string[];
  status?: "active" | "inactive";
  images?: string[];

  address?: {
    street?: string;
    number?: string;
    zipCode?: string;
    province?: string; 
    city?: string;    
    barrio?: string;   
  };

  price?: {
    amount?: number;
    currency?: "USD" | "ARS";
  };

  features?: {
    bedrooms?: number;
    bathrooms?: number;
    totalM2?: number;
    coveredM2?: number;
    rooms?: number;
    garage?: boolean;
  };

  flags?: {
    featured?: boolean;
    opportunity?: boolean;
    premium?: boolean;
  };

  location?: { 
    mapsUrl?: string; 
    lat?: number; 
    lng?: number 
  };

  constructor(data: any) {
    // 1. Campos raíz
    this.title = data.title;
    this.slug = data.slug;
    this.operationType = data.operationType;
    this.propertyTypeSlug = data.propertyTypeSlug;
    this.description = data.description;
    this.age = Number(data.age) || 0;
    this.status = data.status;
    this.images = data.images || [];
    this.tags = data.tags || [];

    // 2. Inflar Dirección (Evitando el CastError de ObjectId)
    this.address = {
      street: data.street,
      number: data.number,
      zipCode: data.zipCode,
      province: data.province || undefined,
      city: data.city || undefined,
      barrio: data.barrio || undefined,
    };

    // 3. Inflar Precio
    this.price = {
      amount: Number(data.priceAmount) || 0,
      currency: data.currency || "USD",
    };

    // 4. Inflar Features
    this.features = {
      bedrooms: Number(data.bedrooms) || 0,
      bathrooms: Number(data.bathrooms) || 0,
      rooms: Number(data.rooms) || 0,
      totalM2: Number(data.totalM2) || 0,
      coveredM2: Number(data.coveredM2) || 0,
      garage: Boolean(data.garage),
    };

    // 5. Inflar Flags
    this.flags = {
      featured: Boolean(data.featured),
      opportunity: Boolean(data.opportunity),
      premium: Boolean(data.premium),
    };

    // 6. Inflar Location (Asegurando que lat/lng sean números)
    this.location = {
      mapsUrl: data.mapsUrl || "",
      lat: data.lat ? Number(data.lat) : 0,
      lng: data.lng ? Number(data.lng) : 0,
    };
  }
}