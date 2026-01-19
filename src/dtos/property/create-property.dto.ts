/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from "@/server/errors/http-error";

export class CreatePropertyDTO {
  title: string;
  price: { amount: number; currency?: string };
  propertyTypeSlug: string;
  zoneSlug: string;
  operationType: string;

  address?: {
    street?: string;
    number?: string;
    zipCode?: string;
  };

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
    if (!data.operationType)
      throw new BadRequestError("Operation type is required");
    if (!data.price?.amount)
      throw new BadRequestError("Price amount is required");
    if (!data.propertyTypeSlug)
      throw new BadRequestError("Property type is required");
    if (!data.zoneSlug) throw new BadRequestError("Zone is required");

    this.title = data.title;
    this.operationType = data.operationType;
    this.propertyTypeSlug = data.propertyTypeSlug;
    this.zoneSlug = data.zoneSlug;

    this.price = {
      amount: Number(data.price.amount),
      currency: data.price.currency || "ARS",
    };

    this.address = data.address
      ? {
          street: data.address.street,
          number: data.address.number,
          zipCode: data.address.zipCode,
        }
      : undefined;

    this.features = data.features || {};
    this.flags = data.flags || {};
  }
}
