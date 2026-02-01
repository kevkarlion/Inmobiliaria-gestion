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
      .populate("propertyType", "name slug") // Lo que ya tenías
      // 🔹 AGREGAMOS LOS NUEVOS POPULATES:
      .populate("address.province", "name slug")
      .populate("address.city", "name slug")
      .populate("address.barrio", "name slug") 
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit ?? DEFAULT_LIMIT);
  }

   static findBySlug(slug: string) {
    return PropertyModel.findOne({ slug, status: "active" })
      .populate("propertyType", "name slug")
      // 🔹 TAMBIÉN EN EL DETALLE:
      .populate("address.province")
      .populate("address.city")
      .populate("address.barrio");
  }

  //paginacion
  static count(filter: any) {
    return PropertyModel.countDocuments(filter);
  }



  static create(data: any) {
    return PropertyModel.create(data);
  }
}
