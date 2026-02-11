/* eslint-disable @typescript-eslint/no-explicit-any */
export class UpdatePropertyDTO {
  title?: string;
  slug?: string;
  operationType?: "venta" | "alquiler";
  propertyTypeSlug?: string;
  description?: string;
  contactPhone?: string; // 👈 1. Agregado en la raíz
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
    age?: number; // 👈 2. Movido aquí dentro
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
    this.title = data.title;
    this.slug = data.slug;
    this.operationType = data.operationType;
    this.propertyTypeSlug = data.propertyTypeSlug;
    this.description = data.description;
    this.contactPhone = data.contactPhone; // 👈 3. Mapeo de teléfono
    this.status = data.status;
    this.images = data.images;
    this.tags = data.tags;

    this.address = {
      street: data.street,
      number: data.number,
      zipCode: data.zipCode,
      province: data.province || undefined,
      city: data.city || undefined,
      barrio: data.barrio || undefined,
    };

    this.price = data.priceAmount ? {
      amount: Number(data.priceAmount),
      currency: data.currency || "USD",
    } : undefined;

    // 4. Age ahora se mapea dentro de features
    this.features = {
      bedrooms: data.bedrooms !== undefined ? Number(data.bedrooms) : undefined,
      bathrooms: data.bathrooms !== undefined ? Number(data.bathrooms) : undefined,
      rooms: data.rooms !== undefined ? Number(data.rooms) : undefined,
      totalM2: data.totalM2 !== undefined ? Number(data.totalM2) : undefined,
      coveredM2: data.coveredM2 !== undefined ? Number(data.coveredM2) : undefined,
      garage: data.garage !== undefined ? Boolean(data.garage) : undefined,
      age: data.age !== undefined ? Number(data.age) : undefined, // 👈 Age aquí
    };

    this.flags = {
      featured: data.featured !== undefined ? Boolean(data.featured) : undefined,
      opportunity: data.opportunity !== undefined ? Boolean(data.opportunity) : undefined,
      premium: data.premium !== undefined ? Boolean(data.premium) : undefined,
    };

    this.location = {
      mapsUrl: data.mapsUrl,
      lat: data.lat !== undefined ? Number(data.lat) : undefined,
      lng: data.lng !== undefined ? Number(data.lng) : undefined,
    };
  }
}