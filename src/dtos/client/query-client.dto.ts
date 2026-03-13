/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { ClientSource } from "@/domain/enums/client-source.enum";

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

class ClientFilterDTO {
  search?: string;
  status?: ClientStatus;
  source?: ClientSource;
  operationType?: "venta" | "alquiler";
  province?: string;
  city?: string;
  assignedTo?: string;

  minPrice?: number;
  maxPrice?: number;

  constructor(query: any) {
    this.search = query.search && query.search.trim() !== "" 
      ? query.search.trim() 
      : undefined;

    this.status = query.status && Object.values(ClientStatus).includes(query.status)
      ? query.status
      : undefined;

    this.source = query.source && Object.values(ClientSource).includes(query.source)
      ? query.source
      : undefined;

    this.operationType = query.operationType && ["venta", "alquiler", "compra"].includes(query.operationType)
      ? query.operationType
      : undefined;

    this.province = query.province && query.province !== ""
      ? query.province
      : undefined;

    this.city = query.city && query.city !== ""
      ? query.city
      : undefined;

    this.assignedTo = query.assignedTo && query.assignedTo !== ""
      ? query.assignedTo
      : undefined;

    this.minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    this.maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
  }
}

class ClientSortDTO {
  field: string;
  order: "asc" | "desc";

  constructor(query: any) {
    const allowedFields = ["name", "createdAt", "updatedAt", "lastActivityAt", "status"];
    const field = query.sortBy || "createdAt";
    const order = query.sortOrder === "asc" ? "asc" : "desc";

    this.field = allowedFields.includes(field) ? field : "createdAt";
    this.order = order;
  }
}

export class QueryClientDTO {
  pagination: PaginationDTO;
  filters: ClientFilterDTO;
  sort: ClientSortDTO;

  constructor(query: any) {
    this.pagination = new PaginationDTO(query);
    this.filters = new ClientFilterDTO(query);
    this.sort = new ClientSortDTO(query);
  }
}
