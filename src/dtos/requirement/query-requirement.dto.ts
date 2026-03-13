/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequirementStatus } from "@/domain/enums/requirement-status.enum";

class PaginationDTO {
  page: number;
  limit: number;
  skip: number;

  constructor(query: any) {
    this.page = Math.max(Number(query.page) || 1, 1);
    this.limit = Math.min(Number(query.limit) || 12, 50);
    this.skip = (this.page - 1) * this.limit;
  }
}

class RequirementFilterDTO {
  search?: string;
  clientId?: string;
  status?: RequirementStatus;
  priority?: "low" | "medium" | "high";
  operationType?: "venta" | "alquiler";
  propertyType?: string;
  province?: string;
  city?: string;

  minPrice?: number;
  maxPrice?: number;

  bedrooms?: number;
  bathrooms?: number;
  minM2?: number;

  constructor(query: any) {
    this.search = query.search && query.search.trim() !== "" 
      ? query.search.trim() 
      : undefined;

    this.clientId = query.clientId && query.clientId !== ""
      ? query.clientId
      : undefined;

    this.status = query.status && Object.values(RequirementStatus).includes(query.status)
      ? query.status
      : undefined;

    this.priority = query.priority && ["low", "medium", "high"].includes(query.priority)
      ? query.priority
      : undefined;

    this.operationType = query.operationType && ["venta", "alquiler"].includes(query.operationType)
      ? query.operationType
      : undefined;

    this.propertyType = query.propertyType && query.propertyType !== ""
      ? query.propertyType
      : undefined;

    this.province = query.province && query.province !== ""
      ? query.province
      : undefined;

    this.city = query.city && query.city !== ""
      ? query.city
      : undefined;

    this.minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    this.maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
    this.bedrooms = query.bedrooms ? Number(query.bedrooms) : undefined;
    this.bathrooms = query.bathrooms ? Number(query.bathrooms) : undefined;
    this.minM2 = query.minM2 ? Number(query.minM2) : undefined;
  }
}

class RequirementSortDTO {
  field: string;
  order: "asc" | "desc";

  constructor(query: any) {
    const allowedFields = ["createdAt", "updatedAt", "priority", "status"];
    const field = query.sortBy || "createdAt";
    const order = query.sortOrder === "asc" ? "asc" : "desc";

    this.field = allowedFields.includes(field) ? field : "createdAt";
    this.order = order;
  }
}

export class QueryRequirementDTO {
  pagination: PaginationDTO;
  filters: RequirementFilterDTO;
  sort: RequirementSortDTO;

  constructor(query: any) {
    this.pagination = new PaginationDTO(query);
    this.filters = new RequirementFilterDTO(query);
    this.sort = new RequirementSortDTO(query);
  }
}
