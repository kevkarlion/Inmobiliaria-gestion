/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientModel } from "@/db/schemas/client.schema";
import { connectDB } from "@/db/connection";
import { modelNames } from "mongoose";

type SortOption = Record<string, 1 | -1>;

type FindAllOptions = {
  sort?: SortOption;
  skip?: number;
  limit?: number;
};

const DEFAULT_LIMIT = 20;

export class ClientRepository {
  /**
   * Lista todos los clientes con filtros y paginación
   */
  static async findAll(filter: any = {}, options: FindAllOptions = {}) {
    await connectDB();
    let query = ClientModel.find(filter)
      .populate("interactions.performedBy", "name email")
      .populate("matches.property", "title slug price images");
    // Optional: populate assignedTo, but guard in case User model is not registered
    try {
      query = query.populate("assignedTo", "name email");
    } catch {
      // ignore if User model is not registered
    }
    return query
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit ?? DEFAULT_LIMIT)
      .lean();
  }

  /**
   * Busca un cliente por ID
   */
  static async findById(id: string) {
    await connectDB();
    let q = ClientModel.findById(id)
      .populate("interactions.performedBy", "name email")
      .populate("matches.property", "title slug price images");
    try {
      q = q.populate("assignedTo", "name email");
    } catch {
      // ignore if User model is not registered
    }
    return q.lean();
  }

  /**
   * Busca un cliente por email (para validar duplicados)
   */
  static async findByEmail(email: string) {
    await connectDB();
    return ClientModel.findOne({ email: email.toLowerCase().trim() }).lean();
  }

  /**
   * Cuenta documentos que coinciden con el filtro
   */
  static count(filter: any) {
    return ClientModel.countDocuments(filter);
  }

  /**
   * Crea un nuevo cliente
   */
  static create(data: any) {
    return ClientModel.create(data);
  }

  /**
   * Actualiza un cliente por ID
   */
  static async updateById(id: string, data: any) {
    await connectDB();
    let q = ClientModel.findByIdAndUpdate(id, data, { new: true })
      .lean();
    if (modelNames().includes("User")) {
      q = (q as any).populate("assignedTo", "name email");
    }
    return q;
  }

  /**
   * Elimina un cliente por ID
   */
  static async deleteById(id: string) {
    await connectDB();
    return ClientModel.findByIdAndDelete(id).lean();
  }
}
