/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyModel } from "@/db/schemas/property.schema";
import { connectDB } from "@/db/connection";

type SortOption = Record<string, 1 | -1>;

type FindAllOptions = {
  sort?: SortOption;
  skip?: number;
  limit?: number;
};

const DEFAULT_LIMIT = 12;

export class PropertyRepository {
  static async findAll(filter: any, options: FindAllOptions = {}) {
    await connectDB();
    return PropertyModel.find(filter)
      .select(
        "title slug price propertyType address location  features flags images contactPhone description",
      )
      .populate("propertyType", "name slug")
      .populate("address.province", "name slug")
      .populate("address.city", "name slug")
      .populate("address.barrio", "name slug")
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit ?? DEFAULT_LIMIT)
      .lean(); // ✅ SOLO ACÁ
  }

  static findBySlug(slug: string) {
    return PropertyModel.findOne({ slug, status: "active" })
      .populate("propertyType", "name slug")
      .populate("address.province")
      .populate("address.city")
      .populate("address.barrio")
      .lean(); // 👈 clave
  }

  // Repository
  static findDocumentBySlug(slug: string) {
    // Documento Mongoose REAL, sin .lean()
    return PropertyModel.findOne({ slug, status: "active" });
  }

  //paginacion
  static count(filter: any) {
    return PropertyModel.countDocuments(filter);
  }

  static create(data: any) {
    return PropertyModel.create(data);
  }

  //SEO
  static async findAllForSitemap() {
    await connectDB();
    return PropertyModel.find({ status: "active" })
      .select("slug updatedAt")
      .lean();
  }
}
