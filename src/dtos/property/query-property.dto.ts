/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginationDTO } from "@/dtos/property/pagination-property.dto";
import { PropertyFilterDTO } from "@/dtos/property/filter-property.dto";
import { PropertySortDTO } from "@/dtos/property/sort-property.dto";

export class QueryPropertyDTO {
  pagination: PaginationDTO;
  filters: PropertyFilterDTO;
  sort: PropertySortDTO;

  constructor(query: any) {
    this.pagination = new PaginationDTO(query);
    this.filters = new PropertyFilterDTO(query);
    this.sort = new PropertySortDTO(query);
  }
}
