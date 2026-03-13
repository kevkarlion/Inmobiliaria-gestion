/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequirementRepository } from "../repositories/requirement.repository";
import { PropertyTypeRepository } from "../repositories/property-type.repository";
import { ClientModel } from "@/db/schemas/client.schema";
import { RequirementModel } from "@/db/schemas/requirement.schema";
import { Province } from "@/db/schemas/province.schema";
import { City } from "@/db/schemas/city.schema";
import { Types } from "mongoose";
import { connectDB } from "@/db/connection";
import { CreateRequirementDTO } from "@/dtos/requirement/create-requirement.dto";
import { UpdateRequirementDTO } from "@/dtos/requirement/update-requirement.dto";
import { QueryRequirementDTO } from "@/dtos/requirement/query-requirement.dto";
import { requirementResponseDTO, RequirementResponse } from "@/dtos/requirement/requirement-response.dto";
import { NotFoundError, BadRequestError } from "@/server/errors/http-error";
import { RequirementStatus } from "@/domain/enums/requirement-status.enum";
import { MatchingService } from "./matching.service";

export class RequirementService {
  /**
   * Crea un nuevo requisito, valida referencias y retorna el objeto poblado.
   */
  static async create(dto: CreateRequirementDTO): Promise<RequirementResponse> {
    await connectDB();

    // 1. Validar que existe el cliente
    const client = await ClientModel.findById(dto.clientId);
    if (!client) {
      throw new BadRequestError(`El cliente con ID "${dto.clientId}" no existe`);
    }

    // 2. Validar y traducir propertyTypes (slugs -> IDs)
    const propertyTypeIds: Types.ObjectId[] = [];
    for (const ptSlug of dto.propertyTypes) {
      const pt = await PropertyTypeRepository.findBySlug(ptSlug);
      if (pt) {
        propertyTypeIds.push(pt._id as Types.ObjectId);
      } else {
        console.warn(`Aviso: El tipo de propiedad "${ptSlug}" no existe.`);
      }
    }

    if (propertyTypeIds.length === 0) {
      throw new BadRequestError("Al menos un tipo de propiedad válido es requerido");
    }

    // 3. Traducir zonas (slugs -> IDs)
    const processedZones = await Promise.all(
      (dto.zones || []).map(async (zone: any) => {
        const processedZone: any = {};
        
        if (zone.province) {
          const provinceDoc = await Province.findOne({ slug: zone.province }).lean();
          if (provinceDoc) {
            processedZone.province = provinceDoc._id;
          }
        }
        
        if (zone.city) {
          const cityDoc = await City.findOne({ slug: zone.city }).lean();
          if (cityDoc) {
            processedZone.city = cityDoc._id;
          }
        }
        
        if (zone.barrio) {
          processedZone.barrio = zone.barrio;
        }
        
        return processedZone;
      })
    );

    // 4. Mapear DTO a datos guardables
    const requirementData: any = {
      clientId: new Types.ObjectId(dto.clientId),
      operationType: dto.operationType,
      propertyTypes: propertyTypeIds,
      zones: processedZones,
      priceRange: dto.priceRange,
      features: dto.features,
      status: dto.status,
      priority: dto.priority,
      notes: dto.notes,
      expiresAt: dto.expiresAt,
      matchedProperties: [],
    };

    // 5. Persistir en Base de Datos
    const savedRequirement = await RequirementRepository.create(requirementData);

    // 6. Actualizar lastActivityAt del cliente
    client.lastActivityAt = new Date();
    await client.save();

    // 7. Ejecutar matching automáticamente para encontrar propiedades coincidentes
    try {
      const matches = await MatchingService.findMatchesForRequirement(savedRequirement._id.toString());
      // Guardar los IDs de las propiedades que hacen match
      const propertyIds = matches
        .filter(m => m.score >= 70) // Solo propiedades con score >= 70%
        .map(m => m.property._id);
      
      if (propertyIds.length > 0) {
        await RequirementRepository.updateById(savedRequirement._id.toString(), {
          matchedProperties: propertyIds
        });
      }
    } catch (matchError) {
      console.error("Error al ejecutar matching automático:", matchError);
      // No fallamos la creación del requisito si el matching falla
    }

    // 8. Recuperer con populate
    const result = await RequirementRepository.findById(savedRequirement._id.toString());

    if (!result) throw new Error("No se pudo recuperar el requisito creado.");

    return requirementResponseDTO(result);
  }

  /**
   * GET /requirements con filtros + paginación
   */
  static async findAll(
    query: QueryRequirementDTO,
  ): Promise<{ items: RequirementResponse[]; meta: { total: number; page: number; limit: number; pages: number } }> {
    await connectDB();
    const filter: any = {};
    const f = query.filters;

    // Filtros simples
    if (f.status) filter.status = f.status;
    if (f.priority) filter.priority = f.priority;
    if (f.operationType) filter.operationType = f.operationType;
    if (f.clientId) filter.clientId = f.clientId;

    // Búsqueda por notes
    if (f.search) {
      filter.notes = { $regex: f.search, $options: "i" };
    }

    // Filtro por tipo de propiedad
    if (f.propertyType) {
      const type = await PropertyTypeRepository.findBySlug(f.propertyType);
      if (type) {
        filter.propertyTypes = type._id;
      }
    }

    // Filtros de ubicación
    if (f.province) {
      const provinceDoc = await Province.findOne({ slug: f.province }).lean();
      if (provinceDoc) {
        filter["zones.province"] = provinceDoc._id;
      }
    }

    if (f.city) {
      const cityDoc = await City.findOne({ slug: f.city }).lean();
      if (cityDoc) {
        filter["zones.city"] = cityDoc._id;
      }
    }

    // Filtros de precio
    if (f.minPrice !== undefined || f.maxPrice !== undefined) {
      filter["priceRange.min"] = { $gte: f.minPrice ?? 0 };
      if (f.maxPrice !== undefined) {
        filter["priceRange.min"].$lte = f.maxPrice;
      }
    }

    // Filtros de features
    if (f.bedrooms !== undefined) {
      filter["features.bedrooms"] = { $gte: f.bedrooms };
    }
    if (f.bathrooms !== undefined) {
      filter["features.bathrooms"] = { $gte: f.bathrooms };
    }
    if (f.minM2 !== undefined) {
      filter["features.minM2"] = { $gte: f.minM2 };
    }

    const { skip, limit, page } = query.pagination;
    const sortField = query.sort.field;
    const sortOrder = query.sort.order;
    const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 } as Record<string, 1 | -1>;

    // Obtener resultados
    const items = await RequirementRepository.findAll(filter, { sort, skip, limit });
    const total = await RequirementRepository.count(filter);

    const normalized = items.map((requirement: any) => requirementResponseDTO(requirement));

    return {
      items: normalized,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * GET /requirements/by-client/:clientId
   */
  static async findByClientId(
    clientId: string,
  ): Promise<RequirementResponse[]> {
    await connectDB();
    
    const requirements = await RequirementRepository.findByClientId(clientId);
    return requirements.map((req: any) => requirementResponseDTO(req));
  }

  /**
   * GET /requirements/:id
   */
  static async findById(id: string): Promise<RequirementResponse> {
    await connectDB();
    const requirement = await RequirementRepository.findById(id);

    if (!requirement) {
      throw new NotFoundError("Requisito no encontrado");
    }

    return requirementResponseDTO(requirement);
  }

  /**
   * PUT /requirements/:id
   */
  static async update(id: string, payload: UpdateRequirementDTO): Promise<RequirementResponse> {
    await connectDB();
    
    // Verificar que existe el requisito
    const existingRequirement = await RequirementModel.findById(id);
    if (!existingRequirement) {
      throw new NotFoundError("Requisito no encontrado");
    }

    const updateData: Record<string, any> = {};

    // Campos simples
    if (payload.operationType !== undefined) updateData.operationType = payload.operationType;
    if (payload.status !== undefined) updateData.status = payload.status;
    if (payload.priority !== undefined) updateData.priority = payload.priority;
    if (payload.notes !== undefined) updateData.notes = payload.notes;
    if (payload.expiresAt !== undefined) updateData.expiresAt = payload.expiresAt;

    // PropertyTypes
    if (payload.propertyTypes !== undefined) {
      const propertyTypeIds: Types.ObjectId[] = [];
      for (const ptSlug of payload.propertyTypes) {
        const pt = await PropertyTypeRepository.findBySlug(ptSlug);
        if (pt) {
          propertyTypeIds.push(pt._id as Types.ObjectId);
        }
      }
      updateData.propertyTypes = propertyTypeIds;
    }

    // Zones
    if (payload.zones !== undefined) {
      const processedZones = await Promise.all(
        payload.zones.map(async (zone: any) => {
          const processedZone: any = {};
          
          if (zone.province) {
            const provinceDoc = await Province.findOne({ slug: zone.province }).lean();
            if (provinceDoc) {
              processedZone.province = provinceDoc._id;
            }
          }
          
          if (zone.city) {
            const cityDoc = await City.findOne({ slug: zone.city }).lean();
            if (cityDoc) {
              processedZone.city = cityDoc._id;
            }
          }
          
          if (zone.barrio) {
            processedZone.barrio = zone.barrio;
          }
          
          return processedZone;
        })
      );
      updateData.zones = processedZones;
    }

    // PriceRange
    if (payload.priceRange !== undefined) {
      updateData.priceRange = {
        min: payload.priceRange.min ?? existingRequirement.priceRange.min,
        max: payload.priceRange.max ?? existingRequirement.priceRange.max,
      };
    }

    // Features
    if (payload.features !== undefined) {
      updateData.features = {
        bedrooms: payload.features.bedrooms ?? existingRequirement.features.bedrooms,
        bathrooms: payload.features.bathrooms ?? existingRequirement.features.bathrooms,
        minM2: payload.features.minM2 ?? existingRequirement.features.minM2,
        garage: payload.features.garage ?? existingRequirement.features.garage,
      };
    }

    // MatchedProperties
    if (payload.matchedProperties !== undefined) {
      const propertyIds = payload.matchedProperties.map((id: string) => new Types.ObjectId(id));
      updateData.matchedProperties = propertyIds;
    }

    // Aplicar cambios
    const updatedRequirement = await RequirementRepository.updateById(id, updateData);

    if (!updatedRequirement) {
      throw new Error("No se pudo actualizar el requisito");
    }

    // Ejecutar matching automáticamente si cambió algo relevante (operationType, propertyTypes, zones, priceRange)
    const relevantFieldsChanged = 
      payload.operationType !== undefined ||
      payload.propertyTypes !== undefined ||
      payload.zones !== undefined ||
      payload.priceRange !== undefined;

    if (relevantFieldsChanged) {
      try {
        const matches = await MatchingService.findMatchesForRequirement(id);
        const propertyIds = matches
          .filter(m => m.score >= 70)
          .map(m => m.property._id);
        
        if (propertyIds.length > 0) {
          await RequirementRepository.updateById(id, {
            matchedProperties: propertyIds
          });
          // Recargar el requisito actualizado
          const refreshed = await RequirementRepository.findById(id);
          if (refreshed) {
            return requirementResponseDTO(refreshed);
          }
        }
      } catch (matchError) {
        console.error("Error al ejecutar matching automático:", matchError);
      }
    }

    return requirementResponseDTO(updatedRequirement);
  }

  /**
   * DELETE /requirements/:id
   */
  static async delete(id: string): Promise<{ message: string }> {
    await connectDB();
    
    const requirement = await RequirementRepository.findById(id);
    if (!requirement) {
      throw new NotFoundError("Requisito no encontrado");
    }

    await RequirementModel.deleteOne({ _id: id });
    return { message: "Requisito eliminado correctamente" };
  }

  /**
   * Cierra un requisito (cambia el estado a fulfilled o cancelled)
   */
  static async closeRequirement(
    id: string,
    status: RequirementStatus.FULFILLED | RequirementStatus.CANCELLED,
  ): Promise<RequirementResponse> {
    await connectDB();
    
    const requirement = await RequirementRepository.findById(id);
    if (!requirement) {
      throw new NotFoundError("Requisito no encontrado");
    }

    const updatedRequirement = await RequirementRepository.updateById(id, {
      status,
    });

    if (!updatedRequirement) {
      throw new Error("No se pudo cerrar el requisito");
    }

    return requirementResponseDTO(updatedRequirement);
  }
}
