/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";

export class CreatePropertyDTO {
  title: string;
  operationType: string;
  propertyTypeSlug: string;
  description: string;
  contactPhone: string; // 👈 Agregado para contacto
  images: { url: string; alt?: string }[];
  imagesDesktop: string[];
  imagesMobile: string[];
  tags: string[];

  price: { 
    amount: number; 
    currency: "USD" | "ARS";
    priceOption: "amount" | "consult";
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
    garageType: "cochera" | "entrada" | "ninguno";
    width: number;
    length: number;
    age: number;
    services: string[];
    additionalInfo: string;
  };
  
  flags: { featured: boolean; premium: boolean; opportunity: boolean };

  // Usuario que crea la propiedad
  createdBy?: { userId: string; email: string };

  constructor(data: any) {
    if (!data.title) throw new BadRequestError("El título es requerido");
    if (!data.priceAmount) throw new BadRequestError("El monto del precio es requerido");
    if (!data.propertyTypeSlug) throw new BadRequestError("El tipo de propiedad es requerido");
    if (!data.province) throw new BadRequestError("La provincia es requerida");
    if (!data.city) throw new BadRequestError("La localidad es requerida");
    
    // Validar precio: o bien tiene monto (priceOption="amount") o bien "consultar" (priceOption="consult")
    if (!data.priceOption) throw new BadRequestError("La opción de precio es requerida");
    if (data.priceOption === "amount" && (!data.priceAmount || data.priceAmount <= 0)) {
      throw new BadRequestError("El monto del precio es requerido cuando seleccionas 'Ingresar monto'");
    }

    // Validar que el título no contenga el tipo de propiedad (evita slug duplicado)
    const typePrefix = data.propertyTypeSlug.toLowerCase();
    const titleLower = data.title.toLowerCase();
    if (titleLower.startsWith(typePrefix + " ") || titleLower.startsWith(typePrefix + "-")) {
      console.warn(`⚠️ El título "${data.title}" comienza con "${data.propertyTypeSlug}". El slug ficará melhor si quitás el tipo del título.`);
    }
    // Validación especial para loteos
    if (typePrefix === "loteos" && titleLower.includes("loteo")) {
      console.warn(`⚠️ El título "${data.title}" contiene "loteo". El slug quedará mejor si quitás esa palabra del título.`);
    }
    // Validación especial para deptos en pozo
    if (typePrefix === "departamento-en-pozo" && titleLower.includes("pozo")) {
      console.warn(`⚠️ El título "${data.title}" contiene "pozo". El slug quedará mejor si quitás esa palabra del título.`);
    }

    this.title = data.title;
    this.operationType = data.operationType;
    this.propertyTypeSlug = data.propertyTypeSlug;
    this.description = data.description || "";
    this.contactPhone = data.contactPhone || ""; // 👈 Mapeo del teléfono
    this.images = data.images || [];
    this.imagesDesktop = data.imagesDesktop || [];
    this.imagesMobile = data.imagesMobile || [];
    this.tags = data.tags || [];

    this.price = {
      amount: Number(data.priceAmount) || 0,
      currency: data.currency === "ARS" ? "ARS" : "USD",
      priceOption: data.priceOption || "amount",
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
      garageType: data.garageType || "ninguno",
      width: Number(data.width) || 0,
      length: Number(data.length) || 0,
      age: Number(data.age) || 0,
      services: data.services || [],
      additionalInfo: data.additionalInfo || "",
    };

    this.flags = {
      featured: Boolean(data.featured),
      premium: Boolean(data.premium),
      opportunity: Boolean(data.opportunity),
    };

    // Usuario que crea la propiedad
    if (data.createdBy) {
      this.createdBy = data.createdBy;
    }
  }
}