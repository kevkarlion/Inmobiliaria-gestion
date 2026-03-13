/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequirementModel } from "@/db/schemas/requirement.schema";
import { RequirementStatus } from "@/domain/enums/requirement-status.enum";
import { connectDB } from "@/db/connection";

type SortOption = Record<string, 1 | -1>;

type FindAllOptions = {
  sort?: SortOption;
  skip?: number;
  limit?: number;
};

const DEFAULT_LIMIT = 20;

export class RequirementRepository {
  /**
   * Lista todos los requisitos con filtros y paginación
   */
  static async findAll(filter: any = {}, options: FindAllOptions = {}) {
    await connectDB();
    return RequirementModel.find(filter)
      .populate("clientId", "name email phone")
      .populate("propertyTypes", "name slug")
      .populate("zones.province", "name slug")
      .populate("zones.city", "name slug")
      .populate("matchedProperties", "title slug price images")
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit ?? DEFAULT_LIMIT)
      .lean();
  }

  /**
   * Busca un requisito por ID
   */
  static async findById(id: string) {
    await connectDB();
    return RequirementModel.findById(id)
      .populate("clientId", "name email phone")
      .populate("propertyTypes", "name slug")
      .populate("zones.province", "name slug")
      .populate("zones.city", "name slug")
      .populate("matchedProperties", "title slug price images")
      .lean();
  }

  /**
   * Busca todos los requisitos de un cliente
   */
  static async findByClientId(clientId: string, options: FindAllOptions = {}) {
    await connectDB();
    return RequirementModel.find({ clientId })
      .populate("propertyTypes", "name slug")
      .populate("zones.province", "name slug")
      .populate("zones.city", "name slug")
      .populate("matchedProperties", "title slug price images")
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit ?? DEFAULT_LIMIT)
      .lean();
  }

  /**
   * Busca solo requisitos activos
   */
  static async findActive(options: FindAllOptions = {}) {
    await connectDB();
    return RequirementModel.find({ status: RequirementStatus.ACTIVE })
      .populate("clientId", "name email phone")
      .populate("propertyTypes", "name slug")
      .populate("zones.province", "name slug")
      .populate("zones.city", "name slug")
      .populate("matchedProperties", "title slug price images")
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit ?? DEFAULT_LIMIT)
      .lean();
  }

  /**
   * Cuenta documentos que coinciden con el filtro
   */
  static count(filter: any) {
    return RequirementModel.countDocuments(filter);
  }

  /**
   * Crea un nuevo requisito
   */
  static create(data: any) {
    return RequirementModel.create(data);
  }

  /**
   * Actualiza un requisito por ID
   */
  static async updateById(id: string, data: any) {
    await connectDB();
    return RequirementModel.findByIdAndUpdate(id, data, { new: true })
      .populate("clientId", "name email phone")
      .populate("propertyTypes", "name slug")
      .populate("zones.province", "name slug")
      .populate("zones.city", "name slug")
      .populate("matchedProperties", "title slug price images")
      .lean();
  }

  /**
   * Elimina un requisito por ID
   */
  static async deleteById(id: string) {
    await connectDB();
    return RequirementModel.findByIdAndDelete(id).lean();
  }
}
