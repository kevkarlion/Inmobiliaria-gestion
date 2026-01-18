/* eslint-disable @typescript-eslint/no-explicit-any */
// 📌 Acá:

// Validás

// Tipás

// Normalizás datos

import { BadRequestError } from "@/server/errors/http-error";

export class CreatePropertyDTO {
  title: string;
  price: { amount: number; currency?: string };
  propertyTypeSlug: string;
  zoneSlug: string;
  operationType: string;
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    garage?: boolean;
    m2?: number;
  };
  flags?: {
    featured?: boolean;
    premium?: boolean;
    opportunity?: boolean;
  };

  constructor(data: any) {
    if (!data.title) throw new BadRequestError("Title is required");
    if (!data.operationType) throw new BadRequestError("Operation type is required");
    if (!data.price?.amount) throw new BadRequestError("Price amount is required");
    if (!data.propertyTypeSlug) throw new BadRequestError("Property type is required");
    if (!data.zoneSlug) throw new BadRequestError("Zone is required");

    this.title = data.title;
    this.price = {
      amount: Number(data.price.amount),
      currency: data.price.currency || "ARS", // default
    };
    this.propertyTypeSlug = data.propertyTypeSlug;
    this.zoneSlug = data.zoneSlug;
    this.operationType = data.operationType;
    this.features = data.features || {};
    this.flags = data.flags || {};
  }
}

