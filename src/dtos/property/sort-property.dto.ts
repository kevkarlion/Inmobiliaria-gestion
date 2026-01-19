/* eslint-disable @typescript-eslint/no-explicit-any */
export class PropertySortDTO {
  sort: Record<string, 1 | -1>;

  constructor(query: any) {
    this.sort =
      query.sort === "price_asc"
        ? { "price.amount": 1 }
        : query.sort === "price_desc"
        ? { "price.amount": -1 }
        : { createdAt: -1 };
  }
}
