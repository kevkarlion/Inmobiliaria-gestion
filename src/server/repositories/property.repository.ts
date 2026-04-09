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
        "title slug price propertyType address location features flags images imagesDesktop imagesMobile contactPhone description createdBy",
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

  /**
   * Combos (operación, tipo, ciudad) que tienen al menos una propiedad activa.
   * Para armar el menú de navegación SEO sin ciudades/tipos vacíos.
   */
  static async getDistinctOperationTypeCity(): Promise<
    { operationType: string; typeSlug: string; typeName: string; citySlug: string; cityName: string }[]
  > {
    await connectDB();
    const rows = await PropertyModel.aggregate([
      { $match: { status: "active" } },
      {
        $lookup: {
          from: "propertytypes",
          localField: "propertyType",
          foreignField: "_id",
          as: "pt",
        },
      },
      { $unwind: "$pt" },
      {
        $lookup: {
          from: "cities",
          localField: "address.city",
          foreignField: "_id",
          as: "city",
        },
      },
      { $unwind: "$city" },
      {
        $group: {
          _id: {
            op: "$operationType",
            typeSlug: "$pt.slug",
            typeName: "$pt.name",
            citySlug: "$city.slug",
            cityName: "$city.name",
          },
        },
      },
      { $sort: { "_id.cityName": 1, "_id.typeName": 1 } },
      {
        $project: {
          _id: 0,
          operationType: "$_id.op",
          typeSlug: "$_id.typeSlug",
          typeName: "$_id.typeName",
          citySlug: "$_id.citySlug",
          cityName: "$_id.cityName",
        },
      },
    ]);
    return rows;
  }

  /**
   * Busca propiedades activas con filtros opcionales.
   * Útil para el algoritmo de matching.
   * 
   * @param filter - Filtros adicionales (operationType, propertyType, etc.)
   * @param options - Opciones de paginación y ordenamiento
   */
  static async findActiveProperties(
    filter: Record<string, unknown> = {},
    options: FindAllOptions = {}
  ): Promise<any[]> {
    await connectDB();
    const baseFilter = { status: "active", ...filter };
    
    return PropertyModel.find(baseFilter)
      .select(
        "title slug price propertyType address location features flags images contactPhone description"
      )
      .populate("propertyType", "name slug")
      .populate("address.province", "name slug")
      .populate("address.city", "name slug")
      .populate("address.barrio", "name slug")
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit ?? 100)
      .lean();
  }
}
