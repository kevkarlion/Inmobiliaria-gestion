/* eslint-disable @typescript-eslint/no-explicit-any */
import slugify from "slugify";
import { PropertyRepository } from "../repositories/property.repository";
import { PropertyTypeRepository } from "../repositories/property-type.repository";
import { ZoneRepository } from "../repositories/zone.repository";
import { PropertyModel } from "@/domain/property/property.schema";
import { UpdatePropertyDTO } from "@/dtos/property/update-property.dto";

import { QueryPropertyDTO } from "@/dtos/property/query-property.dto";

import { NotFoundError, BadRequestError } from "@/server/errors/http-error";

/**
 * Tipo explícito para sort de Mongo
 */

export class PropertyService {
  static async create(payload: any) {
    const { title, operationType, propertyTypeSlug, zoneSlug, ...rest } =
      payload;

    if (!title || !operationType) {
      throw new BadRequestError("Missing required fields");
    }

    const propertyType =
      await PropertyTypeRepository.findBySlug(propertyTypeSlug);
    if (!propertyType) {
      throw new BadRequestError("Invalid property type");
    }

    const zone = await ZoneRepository.findBySlug(zoneSlug);
    if (!zone) {
      throw new BadRequestError("Invalid zone");
    }

    // 🔑 slug único
    let slug = slugify(title, { lower: true });
    let slugExists = await PropertyModel.findOne({ slug });
    let counter = 1;

    while (slugExists) {
      slug = `${slugify(title, { lower: true })}-${counter}`;
      slugExists = await PropertyModel.findOne({ slug });
      counter++;
    }

   
    //envio estrictamente los datos para minimizar errores
    return PropertyRepository.create({
      title,
      slug,
      operationType,
      propertyType: propertyType._id,
      zone: zone._id,
      address: rest.address ?? {},
      price: rest.price
        ? {
            amount: Number(rest.price.amount),
            currency: rest.price.currency || "ARS",
          }
        : { amount: 0, currency: "ARS" },
      features: rest.features || {},
      flags: rest.flags || {},
    });
  }

  /**
   * GET /properties con filtros + paginación
   */

  static async findAll(query: QueryPropertyDTO) {
    // 🔹 filtro base
    const filter: any = {
      status: "active",
    };

    const f = query.filters;

    // 🔍 filtros simples
    if (f.operationType) {
      filter.operationType = f.operationType;
    }

    if (f.search) {
      filter.title = {
        $regex: f.search,
        $options: "i",
      };
    }

    if (f.operationType) {
      filter.operationType = f.operationType.toLowerCase();
    }

    // 💰 precio
    if (f.minPrice !== undefined || f.maxPrice !== undefined) {
      filter["price.amount"] = {};
      if (f.minPrice !== undefined) {
        filter["price.amount"].$gte = f.minPrice;
      }
      if (f.maxPrice !== undefined) {
        filter["price.amount"].$lte = f.maxPrice;
      }
    }

    // 🏷 tipo de propiedad (slug → _id)
    if (f.propertyType) {
      const type = await PropertyTypeRepository.findBySlug(f.propertyType);
      if (type) {
        filter.propertyType = type._id;
      }
    }

    

    // 📍 zona (slug → _id)
    if (f.zone) {
      const zone = await ZoneRepository.findBySlug(f.zone);
      if (zone) {
        filter.zone = zone._id;
      }
    }

    // 🛏 features
    if (f.bedrooms !== undefined) {
      filter["features.bedrooms"] = { $gte: f.bedrooms };
    }

    if (f.bathrooms !== undefined) {
      filter["features.bathrooms"] = { $gte: f.bathrooms };
    }

    if (f.minM2 !== undefined || f.maxM2 !== undefined) {
      filter["features.m2"] = {};
      if (f.minM2 !== undefined) {
        filter["features.m2"].$gte = f.minM2;
      }
      if (f.maxM2 !== undefined) {
        filter["features.m2"].$lte = f.maxM2;
      }
    }

    if (f.garage !== undefined) {
      filter["features.garage"] = f.garage;
    }

    // 🚩 flags
    const flags: Array<keyof typeof f> = ["featured", "premium", "opportunity"];

    flags.forEach((flag) => {
      if (f[flag] !== undefined) {
        filter[`flags.${flag}`] = f[flag];
      }
    });

    // 📄 paginación
    const { skip, limit, page } = query.pagination;

    // 🔃 orden
    const sort = query.sort.sort;

    // ⚡ queries en paralelo
    const [items, total] = await Promise.all([
      PropertyRepository.findAll(filter, { sort, skip, limit }),
      PropertyRepository.count(filter),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  

  /**
   * GET /properties/:slug
   */
  static async findBySlug(slug: string) {
    const property = await PropertyRepository.findBySlug(slug);

    if (!property) {
      throw new NotFoundError("Property not found");
    }

    return property;
  }

  // PUT /properties/:slug
  static async update(slug: string, payload: UpdatePropertyDTO) {
  const property = await PropertyRepository.findBySlug(slug);
  if (!property) throw new NotFoundError("Property not found");

  const updateData: Record<string, any> = { ...payload };

  // propertyType
  if (payload.propertyTypeSlug) {
    const type = await PropertyTypeRepository.findBySlug(payload.propertyTypeSlug);
    if (!type) throw new BadRequestError("Invalid property type");
    updateData.propertyType = type._id;
    delete updateData.propertyTypeSlug;
  }

  // zone
  if (payload.zoneSlug) {
    const zone = await ZoneRepository.findBySlug(payload.zoneSlug);
    if (!zone) throw new BadRequestError("Invalid zone");
    updateData.zone = zone._id;
    delete updateData.zoneSlug;
  }

  // Actualizamos slug si cambia el title
  if (payload.title) {
    let newSlug = slugify(payload.title, { lower: true });
    let slugExists = await PropertyModel.findOne({ slug: newSlug });
    let counter = 1;
    while (slugExists && slugExists._id.toString() !== property._id.toString()) {
      newSlug = `${slugify(payload.title, { lower: true })}-${counter}`;
      slugExists = await PropertyModel.findOne({ slug: newSlug });
      counter++;
    }
    updateData.slug = newSlug;
  }

  // 🔹 Merge parcial de price (amount y/o currency)
  if (payload.price) {
    updateData.price = {
      amount: payload.price.amount ?? property.price.amount,
      currency: payload.price.currency ?? property.price.currency,
    };
  }

  // 🔹 Merge parcial de features
  if (payload.features) {
    updateData.features = {
      bedrooms: payload.features.bedrooms ?? property.features.bedrooms,
      bathrooms: payload.features.bathrooms ?? property.features.bathrooms,
      totalM2: payload.features.totalM2 ?? property.features.totalM2,
      coveredM2: payload.features.coveredM2 ?? property.features.coveredM2,
      rooms: payload.features.rooms ?? property.features.rooms,
      garage: payload.features.garage ?? property.features.garage,
    };
  }

  // 🔹 Merge parcial de address
  if (payload.address) {
    updateData.address = {
      street: payload.address.street ?? property.address?.street,
      number: payload.address.number ?? property.address?.number,
      zipCode: payload.address.zipCode ?? property.address?.zipCode,
    };
  }

  // 🔹 Merge parcial de flags
  if (payload.flags) {
    updateData.flags = {
      featured: payload.flags.featured ?? property.flags.featured,
      opportunity: payload.flags.opportunity ?? property.flags.opportunity,
      premium: payload.flags.premium ?? property.flags.premium,
    };
  }

  // 🔹 Otros campos simples: description, tags, images, status
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.tags !== undefined) updateData.tags = payload.tags;
  if (payload.images !== undefined) updateData.images = payload.images;
  if (payload.status !== undefined) updateData.status = payload.status;

  // 🔹 Merge final: solo actualizar campos existentes en payload
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) property[key] = updateData[key];
  });

  await property.save();

  return property;
}

  // DELETE /properties/:slug
  static async delete(slug: string) {
    const property = await PropertyRepository.findBySlug(slug);
    if (!property) throw new NotFoundError("Property not found");

    await PropertyModel.deleteOne({ _id: property._id });
    return { message: "Property deleted successfully" };
  }
}
