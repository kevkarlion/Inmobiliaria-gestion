/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientRepository } from "../repositories/client.repository";
import { Province } from "@/db/schemas/province.schema";
import { City } from "@/db/schemas/city.schema";
import { ClientModel } from "@/db/schemas/client.schema";
import { Types } from "mongoose";
import { connectDB } from "@/db/connection";
import { CreateClientDTO } from "@/dtos/client/create-client.dto";
import { UpdateClientDTO } from "@/dtos/client/update-client.dto";
import { QueryClientDTO } from "@/dtos/client/query-client.dto";
import { clientResponseDTO, ClientResponse } from "@/dtos/client/client-response.dto";
import { NotFoundError, BadRequestError } from "@/server/errors/http-error";
import { ClientStatus } from "@/domain/enums/client-status.enum";
// Import User model to register schema (required for populate on assignedTo/performedBy fields)
import "@/domain/models/User";

export class ClientService {
  /**
   * Crea un nuevo cliente, valida referencias y retorna el objeto poblado.
   */
  static async create(dto: CreateClientDTO): Promise<ClientResponse> {
    await connectDB();

    // 1. Validar email único (solo si se proporciona)
    if (dto.email) {
      const existingClient = await ClientRepository.findByEmail(dto.email);
      if (existingClient) {
        throw new BadRequestError(`Ya existe un cliente con el email "${dto.email}"`);
      }
    }

    // 2. Procesar propertyPreferences (zonas y features)
    const processedPropertyPreferences = await Promise.all(
      (dto.preferences.propertyPreferences || []).map(async (pref: any) => {
        const processedPref: any = {
          propertyType: pref.propertyType,
        };

        // Procesar zonas
        if (pref.zones && Array.isArray(pref.zones)) {
          const processedZones = await Promise.all(
            pref.zones.map(async (zone: any) => {
              const processedZone: any = {};

              // Buscar provincia por slug o por nombre
              if (zone.province) {
                const provinceDoc = await Province.findOne({ 
                  $or: [{ slug: zone.province }, { name: { $regex: new RegExp(zone.province, 'i') } }] 
                }).lean();
                if (provinceDoc) {
                  processedZone.province = provinceDoc._id;
                  processedZone.provinceName = provinceDoc.name;
                } else {
                  // Si no encuentra, guardar el nombre tal cual
                  processedZone.provinceName = zone.province;
                }
              }

              // Buscar ciudad por slug o por nombre
              if (zone.city) {
                const cityDoc = await City.findOne({ 
                  $or: [{ slug: zone.city }, { name: { $regex: new RegExp(zone.city, 'i') } }] 
                }).lean();
                if (cityDoc) {
                  processedZone.city = cityDoc._id;
                  processedZone.cityName = cityDoc.name;
                } else {
                  // Si no encuentra, guardar el nombre tal cual
                  processedZone.cityName = zone.city;
                }
              }

              if (zone.barrio) {
                processedZone.barrio = zone.barrio;
              }

              return processedZone;
            })
          );
          processedPref.zones = processedZones;
        }

        // Procesar priceRange
        if (pref.priceRange) {
          processedPref.priceRange = {
            min: pref.priceRange.min,
            max: pref.priceRange.max,
          };
        }

        // Copiar features tal cual (ya vienen procesados del DTO)
        if (pref.features) {
          processedPref.features = pref.features;
        }

        // Copiar notes
        if (pref.notes) {
          processedPref.notes = pref.notes;
        }

        return processedPref;
      })
    );

    // 3. Mapear DTO a datos guardables
    const clientData: any = {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      status: dto.status,
      source: dto.source,
      preferences: {
        operationType: dto.preferences.operationType,
        propertyPreferences: processedPropertyPreferences,
      },
      notes: dto.notes,
      assignedTo: dto.assignedTo ? new Types.ObjectId(dto.assignedTo) : undefined,
      interactions: [],
      matches: [],
      lastActivityAt: new Date(),
    };

    // Agregar saleProperty si existe (solo para operación venta)
    if (dto.saleProperty) {
      clientData.saleProperty = dto.saleProperty;
    }

    // 4. Persistir en Base de Datos
    const savedClient = await ClientRepository.create(clientData);

    // 5. Recuperar con populate
    const result = await ClientRepository.findById(savedClient._id.toString());

    if (!result) throw new Error("No se pudo recuperar el cliente creado.");

    return clientResponseDTO(result);
  }

  /**
   * GET /clients con filtros + paginación
   */
  static async findAll(
    query: QueryClientDTO,
  ): Promise<{ items: ClientResponse[]; meta: { total: number; page: number; limit: number; pages: number } }> {
    await connectDB();
    const filter: any = {};
    const f = query.filters;

    // Filtros simples
    if (f.status) filter.status = f.status;
    if (f.source) filter.source = f.source;
    if (f.assignedTo) filter.assignedTo = f.assignedTo;

    // Búsqueda por nombre, email o teléfono
    if (f.search) {
      filter.$or = [
        { name: { $regex: f.search, $options: "i" } },
        { email: { $regex: f.search, $options: "i" } },
        { phone: { $regex: f.search, $options: "i" } },
      ];
    }

    // Filtro por tipo de operación (en preferences)
    if (f.operationType) {
      filter["preferences.operationType"] = f.operationType;
    }

    // Filtros de ubicación - buscar en cualquier propertyPreference
    if (f.province) {
      const provinceDoc = await Province.findOne({ slug: f.province }).lean();
      if (provinceDoc) {
        filter["preferences.propertyPreferences.zones.province"] = provinceDoc._id;
      }
    }

    if (f.city) {
      const cityDoc = await City.findOne({ slug: f.city }).lean();
      if (cityDoc) {
        filter["preferences.propertyPreferences.zones.city"] = cityDoc._id;
      }
    }

    // Filtros de precio - buscar en cualquier propertyPreference
    if (f.minPrice !== undefined || f.maxPrice !== undefined) {
      filter["preferences.propertyPreferences.priceRange.min"] = { $gte: f.minPrice ?? 0 };
      if (f.maxPrice !== undefined) {
        filter["preferences.propertyPreferences.priceRange.min"].$lte = f.maxPrice;
      }
    }

    const { skip, limit, page } = query.pagination;
    const sortField = query.sort.field;
    const sortOrder = query.sort.order;
    const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 } as Record<string, 1 | -1>;

    // Obtener resultados
    const items = await ClientRepository.findAll(filter, { sort, skip, limit });
    const total = await ClientRepository.count(filter);

    const normalized = items.map((client: any) => clientResponseDTO(client));

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
   * GET /clients/:id
   */
  static async findById(id: string): Promise<ClientResponse> {
    await connectDB();
    const client = await ClientRepository.findById(id);

    if (!client) {
      throw new NotFoundError("Cliente no encontrado");
    }

    return clientResponseDTO(client);
  }

  /**
   * PUT /clients/:id
   */
  static async update(id: string, payload: UpdateClientDTO): Promise<ClientResponse> {
    await connectDB();

    // Verificar que existe el cliente
    const existingClient = await ClientModel.findById(id);
    if (!existingClient) {
      throw new NotFoundError("Cliente no encontrado");
    }

    // Validar email único (si cambia y tiene valor)
    if (payload.email && payload.email !== existingClient.email) {
      const duplicateClient = await ClientRepository.findByEmail(payload.email);
      if (duplicateClient) {
        throw new BadRequestError(`Ya existe un cliente con el email "${payload.email}"`);
      }
    }

    const updateData: Record<string, any> = {};

    // Campos simples
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.email !== undefined) updateData.email = payload.email;
    if (payload.phone !== undefined) updateData.phone = payload.phone;
    if (payload.status !== undefined) updateData.status = payload.status;
    if (payload.source !== undefined) updateData.source = payload.source;
    if (payload.notes !== undefined) updateData.notes = payload.notes;
    if (payload.assignedTo !== undefined) {
      updateData.assignedTo = payload.assignedTo
        ? new Types.ObjectId(payload.assignedTo)
        : undefined;
    }

    // Preferences
    if (payload.preferences !== undefined) {
      const prefData: any = {};

      if (payload.preferences.operationType !== undefined) {
        prefData.operationType = payload.preferences.operationType;
      }

      // Procesar propertyPreferences
      if (payload.preferences.propertyPreferences !== undefined) {
        const processedPropertyPreferences = await Promise.all(
          payload.preferences.propertyPreferences.map(async (pref: any) => {
            const processedPref: any = {
              propertyType: pref.propertyType,
            };

            // Procesar zonas
            if (pref.zones && Array.isArray(pref.zones)) {
              const processedZones = await Promise.all(
                pref.zones.map(async (zone: any) => {
                  const processedZone: any = {};

                  // Buscar provincia por slug o por nombre
                  if (zone.province) {
                    const provinceDoc = await Province.findOne({ 
                      $or: [{ slug: zone.province }, { name: { $regex: new RegExp(zone.province, 'i') } }] 
                    }).lean();
                    if (provinceDoc) {
                      processedZone.province = provinceDoc._id;
                      processedZone.provinceName = provinceDoc.name;
                    } else {
                      processedZone.provinceName = zone.province;
                    }
                  }

                  // Buscar ciudad por slug o por nombre
                  if (zone.city) {
                    const cityDoc = await City.findOne({ 
                      $or: [{ slug: zone.city }, { name: { $regex: new RegExp(zone.city, 'i') } }] 
                    }).lean();
                    if (cityDoc) {
                      processedZone.city = cityDoc._id;
                      processedZone.cityName = cityDoc.name;
                    } else {
                      processedZone.cityName = zone.city;
                    }
                  }

                  if (zone.barrio) {
                    processedZone.barrio = zone.barrio;
                  }

                  return processedZone;
                })
              );
              processedPref.zones = processedZones;
            }

            // Procesar priceRange
            if (pref.priceRange) {
              processedPref.priceRange = {
                min: pref.priceRange.min,
                max: pref.priceRange.max,
              };
            }

            // Copiar features
            if (pref.features) {
              processedPref.features = pref.features;
            }

            // Copiar notes
            if (pref.notes !== undefined) {
              processedPref.notes = pref.notes;
            }

            return processedPref;
          })
        );

        prefData.propertyPreferences = processedPropertyPreferences;
      }

      updateData.preferences = prefData;
    }

    // Actualizar saleProperty si se proporciona
    if (payload.saleProperty !== undefined) {
      updateData.saleProperty = payload.saleProperty;
    }

    // Actualizar timestamp de actividad
    updateData.lastActivityAt = new Date();

    // Aplicar cambios
    const updatedClient = await ClientRepository.updateById(id, updateData);

    if (!updatedClient) {
      throw new Error("No se pudo actualizar el cliente");
    }

    return clientResponseDTO(updatedClient);
  }

  /**
   * DELETE /clients/:id
   */
  static async delete(id: string): Promise<{ message: string }> {
    await connectDB();

    const client = await ClientRepository.findById(id);
    if (!client) {
      throw new NotFoundError("Cliente no encontrado");
    }

    await ClientModel.deleteOne({ _id: id });
    return { message: "Cliente eliminado correctamente" };
  }

  /**
   * Cambia el estado de un cliente
   */
  static async changeStatus(
    id: string,
    status: ClientStatus,
  ): Promise<ClientResponse> {
    await connectDB();

    const client = await ClientRepository.findById(id);
    if (!client) {
      throw new NotFoundError("Cliente no encontrado");
    }

    const updatedClient = await ClientRepository.updateById(id, {
      status,
      lastActivityAt: new Date(),
    });

    if (!updatedClient) {
      throw new Error("No se pudo cambiar el estado del cliente");
    }

    return clientResponseDTO(updatedClient);
  }

  /**
   * Agrega una nota/interacción al cliente
   */
  static async addNote(
    id: string,
    note: {
      type: "llamada" | "whatsapp" | "email" | "reunion" | "visita" | "nota";
      description: string;
      performedBy?: string;
    },
  ): Promise<ClientResponse> {
    await connectDB();

    const client = await ClientModel.findById(id);
    if (!client) {
      throw new NotFoundError("Cliente no encontrado");
    }

    const interaction = {
      date: new Date(),
      type: note.type,
      description: note.description,
      performedBy: note.performedBy
        ? new Types.ObjectId(note.performedBy)
        : undefined,
    };

    client.interactions.push(interaction);
    client.lastActivityAt = new Date();
    await client.save();

    // Recargar con populate
    const updatedClient = await ClientRepository.findById(id);
    if (!updatedClient) {
      throw new Error("No se pudo recuperar el cliente actualizado");
    }

    return clientResponseDTO(updatedClient);
  }
}
