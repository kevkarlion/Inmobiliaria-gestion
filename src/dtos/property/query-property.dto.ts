export class QueryPropertyDTO {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;

  constructor(query: any) {
    this.page = Math.max(Number(query.page) || 1, 1);
    this.limit = Math.min(Number(query.limit) || 12, 50);
    this.skip = (this.page - 1) * this.limit;

    this.sort = query.sort === "price_asc"
      ? { price: 1 }
      : { createdAt: -1 };
  }
}
