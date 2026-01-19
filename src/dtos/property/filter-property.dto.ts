/* eslint-disable @typescript-eslint/no-explicit-any */
export class PropertyFilterDTO {
  operationType?: string;
  propertyType?: string;
  zone?: string;
  search?: string;

  minPrice?: number;
  maxPrice?: number;

  bedrooms?: number;
  bathrooms?: number;
  minM2?: number;
  maxM2?: number;

  garage?: boolean;

  featured?: boolean;
  premium?: boolean;
  opportunity?: boolean;

  constructor(query: any) {
    // 🔑 STRINGS
    this.operationType =
      query.operationType && query.operationType !== ""
        ? query.operationType
        : undefined;

    this.propertyType =
      query.propertyType && query.propertyType !== ""
        ? query.propertyType
        : undefined;

    this.zone =
      query.zone && query.zone !== ""
        ? query.zone
        : undefined;

    this.search =
      query.search && query.search.trim() !== ""
        ? query.search.trim()
        : undefined;

    // 🔢 NUMBERS
    this.minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    this.maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

    this.bedrooms = query.bedrooms ? Number(query.bedrooms) : undefined;
    this.bathrooms = query.bathrooms ? Number(query.bathrooms) : undefined;

    this.minM2 = query.minM2 ? Number(query.minM2) : undefined;
    this.maxM2 = query.maxM2 ? Number(query.maxM2) : undefined;

    // ✅ BOOLEANS
    this.garage =
      query.garage === "true"
        ? true
        : query.garage === "false"
        ? false
        : undefined;

    this.featured =
      query.featured === "true"
        ? true
        : query.featured === "false"
        ? false
        : undefined;

    this.premium =
      query.premium === "true"
        ? true
        : query.premium === "false"
        ? false
        : undefined;

    this.opportunity =
      query.opportunity === "true"
        ? true
        : query.opportunity === "false"
        ? false
        : undefined;
  }
}
