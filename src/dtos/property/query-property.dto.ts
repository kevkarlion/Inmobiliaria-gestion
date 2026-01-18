/* eslint-disable @typescript-eslint/no-explicit-any */
export class QueryPropertyDTO {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;

  // filtros
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
    // paginación
    this.page = Math.max(Number(query.page) || 1, 1);
    this.limit = Math.min(Number(query.limit) || 12, 50);
    this.skip = (this.page - 1) * this.limit;

    // sort
    this.sort =
      query.sort === "price_asc"
        ? { "price.amount": 1 }
        : query.sort === "price_desc"
        ? { "price.amount": -1 }
        : { createdAt: -1 };

    // filtros directos
    this.operationType = query.operationType;
    this.propertyType = query.propertyType;
    this.zone = query.zone;
    this.search = query.search;

    this.minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    this.maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

    this.bedrooms = query.bedrooms ? Number(query.bedrooms) : undefined;
    this.bathrooms = query.bathrooms ? Number(query.bathrooms) : undefined;

    this.minM2 = query.minM2 ? Number(query.minM2) : undefined;
    this.maxM2 = query.maxM2 ? Number(query.maxM2) : undefined;

    this.garage =
      query.garage !== undefined ? query.garage === "true" : undefined;

    this.featured =
      query.featured !== undefined ? query.featured === "true" : undefined;

    this.premium =
      query.premium !== undefined ? query.premium === "true" : undefined;

    this.opportunity =
      query.opportunity !== undefined ? query.opportunity === "true" : undefined;
  }
}
