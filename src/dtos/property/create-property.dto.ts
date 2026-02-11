/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";

export class CreatePropertyDTO {
  title: string;
  operationType: string;
  propertyTypeSlug: string;
  description: string;
  contactPhone: string; // 👈 Agregado para contacto
  images: { url: string; alt?: string }[];
  tags: string[];

  price: { 
    amount: number; 
    currency: "USD" | "ARS";
  };
  
  address: { 
    street: string; 
    number: string; 
    zipCode: string;
    provinceSlug: string; 
    citySlug: string;     
    barrioSlug?: string;  
  };
  
  location: { mapsUrl: string; lat: number; lng: number };
  
  features: { 
    bedrooms: number; 
    bathrooms: number; 
    totalM2: number; 
    coveredM2: number; 
    rooms: number; 
    garage: boolean; 
    age: number; // 👈 Movido aquí
    additionalInfo: string;
  };
  
  flags: { featured: boolean; premium: boolean; opportunity: boolean };

  constructor(data: any) {
    if (!data.title) throw new BadRequestError("El título es requerido");
    if (!data.priceAmount) throw new BadRequestError("El monto del precio es requerido");
    if (!data.propertyTypeSlug) throw new BadRequestError("El tipo de propiedad es requerido");
    if (!data.province) throw new BadRequestError("La provincia es requerida");
    if (!data.city) throw new BadRequestError("La localidad es requerida");

    this.title = data.title;
    this.operationType = data.operationType;
    this.propertyTypeSlug = data.propertyTypeSlug;
    this.description = data.description || "";
    this.contactPhone = data.contactPhone || ""; // 👈 Mapeo del teléfono
    this.images = data.images || [];
    this.tags = data.tags || [];

    this.price = {
      amount: Number(data.priceAmount),
      currency: data.currency === "ARS" ? "ARS" : "USD",
    };

    this.address = {
      street: data.street || "",
      number: data.number || "",
      zipCode: data.zipCode || "",
      provinceSlug: data.province, 
      citySlug: data.city,         
      barrioSlug: data.barrio || undefined, 
    };

    this.location = {
      mapsUrl: data.mapsUrl || "",
      lat: Number(data.lat) || 0,
      lng: Number(data.lng) || 0,
    };

    this.features = {
      bedrooms: Number(data.bedrooms) || 0,
      bathrooms: Number(data.bathrooms) || 0,
      totalM2: Number(data.totalM2) || 0,
      coveredM2: Number(data.coveredM2) || 0,
      rooms: Number(data.rooms) || 0,
      garage: Boolean(data.garage),
      age: Number(data.age) || 0, // 👈 Mapeo dentro de features
      additionalInfo: data.additionalInfo || "",
    };

    this.flags = {
      featured: Boolean(data.featured),
      premium: Boolean(data.premium),
      opportunity: Boolean(data.opportunity),
    };
  }
}