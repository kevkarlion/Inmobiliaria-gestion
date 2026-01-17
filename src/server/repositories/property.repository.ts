import { PropertyModel } from "@/db/schemas/property.schema";

type FindAllOptions = {
  sort?: any;
  skip?: number;
  limit?: number;
};

export class PropertyRepository {


  static findAll(filter: any, options?: FindAllOptions) {
    return PropertyModel.find(filter)
      .populate("propertyType", "name slug")
      .populate("zone", "name slug")
      .sort(options?.sort || { createdAt: -1 })
      .skip(options?.skip || 0)
      .limit(options?.limit || 0);
  }

  static async create(data: any) {
    return PropertyModel.create(data);
  }



  static findBySlug(slug: string) {
  return PropertyModel.findOne({ slug, status: "active" })
    .populate("propertyType", "name slug")
    .populate("zone", "name slug");
}




}
