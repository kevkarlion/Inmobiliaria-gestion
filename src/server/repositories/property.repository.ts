/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyModel } from "@/db/schemas/property.schema";

type SortOption = Record<string, 1 | -1>;

type FindAllOptions = {
  sort?: SortOption;
  skip?: number;
  limit?: number;
};

const DEFAULT_LIMIT = 12;

export class PropertyRepository {
  
  static findAll(filter: any, options: FindAllOptions = {}) {
    return PropertyModel.find(filter)
      .populate("propertyType", "name slug")
      .populate("zone", "name slug")
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit ?? DEFAULT_LIMIT);
  }

  //paginacion
  static count(filter: any) {
    return PropertyModel.countDocuments(filter);
  }



  static findBySlug(slug: string) {
    return PropertyModel.findOne({ slug, status: "active" })
      .populate("propertyType", "name slug")
      .populate("zone", "name slug");
  }

  static create(data: any) {
    return PropertyModel.create(data);
  }
}
