/* eslint-disable @typescript-eslint/no-explicit-any */
export class PaginationDTO {
  page: number;
  limit: number;
  skip: number;

  constructor(query: any) {
    this.page = Math.max(Number(query.page) || 1, 1);
    this.limit = Math.min(Number(query.limit) || 12, 50);
    this.skip = (this.page - 1) * this.limit;
  }
}
