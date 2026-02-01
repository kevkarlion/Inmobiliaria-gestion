/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";

export class CreatePropertyDTO {
  title: string;
  operationType: string;
  propertyTypeSlug: string;
  zoneSlug: string;
  description: string;
  age: number;
  images: string[];
  tags: string[];

  price: { 
    amount: number; 
    currency: "USD" | "ARS" // 👈 Cambia 'string' por esto
  };
  address: { street: string; number: string; zipCode: string };
  location: { mapsUrl: string; lat: number; lng: number }; // Inflado
  features: { 
    bedrooms: number; 
    bathrooms: number; 
    totalM2: number; 
    coveredM2: number; 
    rooms: number; 
    garage: boolean; 
    additionalInfo: string;
  };
  flags: { featured: boolean; premium: boolean; opportunity: boolean };

  constructor(data: any) {
    if (!data.title) throw new BadRequestError("Title is required");
    if (!data.priceAmount) throw new BadRequestError("Price amount is required");
    if (!data.propertyTypeSlug) throw new BadRequestError("Property type slug is required");
    if (!data.zoneSlug) throw new BadRequestError("Zone slug is required");

    this.title = data.title;
    this.operationType = data.operationType;
    this.propertyTypeSlug = data.propertyTypeSlug;
    this.zoneSlug = data.zoneSlug;
    this.description = data.description || "";
    this.age = Number(data.age) || 0;
    this.images = data.images || [];
    this.tags = data.tags || [];

    this.price = {
      amount: Number(data.priceAmount),
      currency: data.currency || "USD",
    };

    this.address = {
      street: data.street || "",
      number: data.number || "",
      zipCode: data.zipCode || "",
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
      additionalInfo: data.features || "",
    };

    this.flags = {
      featured: Boolean(data.featured),
      premium: Boolean(data.premium),
      opportunity: Boolean(data.opportunity),
    };
  }
}