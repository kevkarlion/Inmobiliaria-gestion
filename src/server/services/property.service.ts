/* eslint-disable @typescript-eslint/no-explicit-any */
import slugify from "slugify";
import { PropertyRepository } from "../repositories/property.repository";
import { PropertyTypeRepository } from "../repositories/property-type.repository";
import { PropertyModel } from "@/db/schemas/property.schema";
import { IProperty } from "@/domain/interfaces/property.interface";
import {
  FindAllPropertiesResult,
  Property,
} from "@/domain/types/Property.types";
import { CreatePropertyDTO } from "@/dtos/property/create-property.dto";
import { UpdatePropertyDTO } from "@/dtos/property/update-property.dto";
import { QueryPropertyDTO } from "@/dtos/property/query-property.dto";
import { NotFoundError, BadRequestError } from "@/server/errors/http-error";
import { Province } from "@/db/schemas/province.schema";
import { City } from "@/db/schemas/city.schema";
import { Barrio } from "@/db/schemas/barrio.schema";
import { Types } from "mongoose";
import { connectDB } from "@/db/connection";
import { revalidatePath } from "next/cache";
import { buildPropertySeoSlug } from "@/lib/propertySlug";
import type { NavMenuStructure, TypeMenuEntry } from "@/lib/seoUrls";

export class PropertyService {
  /**
   * Crea una nueva propiedad, valida referencias y retorna el objeto poblado.
   */
  static async create(dto: CreatePropertyDTO): Promise<Property> {
    // 1. Validar Tipo de Propiedad (Slug)
    const propertyType = await PropertyTypeRepository.findBySlug(
      dto.propertyTypeSlug,
    );
    if (!propertyType)
      throw new BadRequestError(`El tipo '${dto.propertyTypeSlug}' no existe.`);

    // 2. Traducir Slugs de Ubicación a IDs Reales
    const [provinceDoc, cityDoc] = await Promise.all([
      Province.findOne({ slug: dto.address.provinceSlug }),
      City.findOne({ slug: dto.address.citySlug }),
    ]);

    if (!provinceDoc)
      throw new BadRequestError(
        `La provincia '${dto.address.provinceSlug}' no existe.`,
      );
    if (!cityDoc)
      throw new BadRequestError(
        `La localidad '${dto.address.citySlug}' no existe.`,
      );

    // Validar Barrio si viene (Opcional)
    let barrioId: Types.ObjectId | undefined = undefined;
    if (dto.address.barrioSlug) {
      const barrioDoc = await Barrio.findOne({ slug: dto.address.barrioSlug });
      if (barrioDoc) {
        barrioId = barrioDoc._id as Types.ObjectId;
      } else {
        console.warn(
          `Aviso: El barrio slug '${dto.address.barrioSlug}' no se encontró.`,
        );
      }
    }

    // 3. Generar Slug SEO único: tipo-titulo-ciudad (ej: terreno-el-mirador-general-roca)
    let slug = buildPropertySeoSlug(
      dto.propertyTypeSlug,
      dto.title,
      dto.address.citySlug
    );
    let slugExists = await PropertyModel.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${buildPropertySeoSlug(dto.propertyTypeSlug, dto.title, dto.address.citySlug)}-${counter}`;
      slugExists = await PropertyModel.findOne({ slug });
      counter++;
    }

    // 4. Limpieza de Maps URL
    let cleanMapsUrl = dto.location?.mapsUrl || "";
    if (cleanMapsUrl.includes("<iframe")) {
      const match = cleanMapsUrl.match(/src="([^"]+)"/);
      cleanMapsUrl = match ? match[1] : cleanMapsUrl;
    }

    // 5. Mapear DTO a IProperty (CON CAMBIOS EN CONTACTPHONE Y AGE)
    const propertyToSave: Partial<IProperty> = {
      title: dto.title,
      slug: slug,
      contactPhone: dto.contactPhone, // 👈 Se agrega a la raíz
      operationType: dto.operationType as "venta" | "alquiler",
      propertyType: propertyType._id,
      price: {
        amount: dto.price.amount,
        currency: dto.price.currency as "USD" | "ARS",
      },
      address: {
        street: dto.address.street,
        number: dto.address.number,
        zipCode: dto.address.zipCode,
        province: provinceDoc._id as Types.ObjectId,
        city: cityDoc._id as Types.ObjectId,
        barrio: barrioId,
      },
      location: {
        mapsUrl: cleanMapsUrl,
        lat: Number(dto.location?.lat) || 0,
        lng: Number(dto.location?.lng) || 0,
      },
      features: {
        ...dto.features,
        age: Number(dto.features.age) || 0, // 👈 Age ahora vive dentro de features
      },
      flags: { ...dto.flags },
      description: dto.description || "",
      status: "active",
      tags: dto.tags || [],
      images: Array.isArray(dto.images)
        ? dto.images
        : [dto.images].filter(Boolean),
      createdBy: dto.createdBy ? {
        userId: new Types.ObjectId(dto.createdBy.userId),
        email: dto.createdBy.email,
      } : undefined,
    };

    // 6. Persistir en Base de Datos
    const savedProperty = await PropertyRepository.create(propertyToSave);

    // 🔥 INVALIDACIÓN
    revalidatePath("/");
    revalidatePath("/propiedades/oportunidad");
    revalidatePath("/propiedades/venta");
    revalidatePath("/propiedades/alquiler");

    // 7. Recuperar con Populate
    const result = await PropertyModel.findById(savedProperty._id)
      .populate("propertyType")
      .populate("address.province")
      .populate("address.city")
      .populate("address.barrio")
      .lean();

    if (!result) throw new Error("No se pudo recuperar la propiedad creada.");

    // 8. Retorno final
    return {
      ...result,
      _id: result._id.toString(),
    } as unknown as Property;
  }

  /**
   * GET /properties con filtros + paginación
   */

  static async findAll(
    query: QueryPropertyDTO,
  ): Promise<FindAllPropertiesResult> {
    await connectDB();
    const filter: any = { status: "active" };
    const f = query.filters;

    // filtros simples
    if (f.operationType) filter.operationType = f.operationType.toLowerCase();
    if (f.search) filter.title = { $regex: f.search, $options: "i" };

    // ubicación
    if (f.province) {
      const provinceDoc = await Province.findOne({ slug: f.province }).lean();
      if (provinceDoc) filter["address.province"] = provinceDoc._id;
    }

    if (f.city) {
      const cityDoc = await City.findOne({ slug: f.city }).lean();
      if (cityDoc) filter["address.city"] = cityDoc._id;
    }

    if (f.barrio) {
      const barrioDoc = await Barrio.findOne({ slug: f.barrio }).lean();
      if (barrioDoc) filter["address.barrio"] = barrioDoc._id;
    }

    // precio
    if (f.minPrice !== undefined || f.maxPrice !== undefined) {
      filter["price.amount"] = {};
      if (f.minPrice !== undefined) filter["price.amount"].$gte = f.minPrice;
      if (f.maxPrice !== undefined) filter["price.amount"].$lte = f.maxPrice;
    }

    // tipo
    if (f.propertyType) {
      const type = await PropertyTypeRepository.findBySlug(f.propertyType);
      if (type) filter.propertyType = type._id;
    }

    // features
    if (f.bedrooms !== undefined)
      filter["features.bedrooms"] = { $gte: f.bedrooms };
    if (f.bathrooms !== undefined)
      filter["features.bathrooms"] = { $gte: f.bathrooms };

    // flags
    // flags (solo true)
    ["featured", "premium", "opportunity"].forEach((flag) => {
      if (f[flag as keyof typeof f] === true) {
        filter[`flags.${flag}`] = true;
      }
    });

    const { skip, limit, page } = query.pagination;
    const sort = query.sort.sort;

    // 👇 acá ya vienen objetos planos (gracias al .lean del repo)
    const items = await PropertyRepository.findAll(filter, {
      sort,
      skip,
      limit,
    });

    const total = await PropertyRepository.count(filter);

    const normalized = items.map((obj: any) => ({
      ...obj,
      _id: obj._id.toString(),
      images: obj.images || [],
    }));

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
   * GET /properties/:slug
   */
  // property.service.ts
static async findBySlug(slug: string) {
  await connectDB();   // <-- ESTA ERA LA QUE FALTABA
  return await PropertyRepository.findBySlug(slug);
}


  // PUT /properties/:slug
static async update(slug: string, payload: UpdatePropertyDTO) {
  const property = await PropertyRepository.findDocumentBySlug(slug);
  

  if (!property) throw new NotFoundError("Property not found");

  const updateData: Record<string, any> = {};

  // Tipo de propiedad
  if (payload.propertyTypeSlug) {
    const type = await PropertyTypeRepository.findBySlug(payload.propertyTypeSlug);
    if (!type) throw new BadRequestError("Invalid property type");
    updateData.propertyType = type._id;
  }

  // Título
  if (payload.title && payload.title !== property.title) {
    updateData.title = payload.title;
  }

  // Dirección
  if (payload.address) {
    const [provinceDoc, cityDoc] = await Promise.all([
      payload.address.province ? Province.findOne({ slug: payload.address.province }) : null,
      payload.address.city ? City.findOne({ slug: payload.address.city }) : null,
    ]);

    property.address.street = payload.address.street ?? property.address?.street;
    property.address.number = payload.address.number ?? property.address?.number;
    property.address.zipCode = payload.address.zipCode ?? property.address?.zipCode;
    property.address.province = provinceDoc ? provinceDoc._id : property.address?.province;
    property.address.city = cityDoc ? cityDoc._id : property.address?.city;

    // Barrio como string libre, permite vaciarlo
    if ('barrio' in payload.address) {
      property.address.barrio = payload.address.barrio ? payload.address.barrio.toString() : null;
    }
  }

  // Precio
  if (payload.price) {
    updateData.price = {
      ...property.price,
      amount: payload.price.amount ?? property.price.amount,
      currency: payload.price.currency ?? property.price.currency,
    };
  }

  // Features
  if (payload.features) {
    updateData.features = {
      ...property.features,
      bedrooms: payload.features.bedrooms ?? property.features.bedrooms,
      bathrooms: payload.features.bathrooms ?? property.features.bathrooms,
      totalM2: payload.features.totalM2 ?? property.features.totalM2,
      coveredM2: payload.features.coveredM2 ?? property.features.coveredM2,
      rooms: payload.features.rooms ?? property.features.rooms,
      garage: payload.features.garage ?? property.features.garage,
      garageType: payload.features.garageType ?? property.features.garageType ?? "ninguno",
      width: payload.features.width ?? property.features.width ?? 0,
      length: payload.features.length ?? property.features.length ?? 0,
      age: payload.features.age ?? property.features.age,
      services: payload.features.services ?? property.features.services ?? [],
    };
  }

  // Flags
  if (payload.flags) {
    updateData.flags = {
      ...property.flags,
      featured: payload.flags.featured ?? property.flags?.featured,
      opportunity: payload.flags.opportunity ?? property.flags?.opportunity,
      premium: payload.flags.premium ?? property.flags?.premium,
    };
  }

  // Campos simples
  const simpleFields: (keyof UpdatePropertyDTO)[] = [
    "description",
    "tags",
    "images",
    "status",
    "operationType",
    "contactPhone",
  ];
  simpleFields.forEach((field) => {
    if (payload[field] !== undefined) updateData[field as string] = payload[field];
  });

  // Location
  if (payload.location) {
    let cleanMapsUrl = payload.location.mapsUrl ?? property.location?.mapsUrl;
    if (cleanMapsUrl?.includes("<iframe")) {
      const match = cleanMapsUrl.match(/src="([^"]+)"/);
      if (match) cleanMapsUrl = match[1];
    }
    updateData.location = {
      mapsUrl: cleanMapsUrl,
      lat: payload.location.lat ?? property.location?.lat,
      lng: payload.location.lng ?? property.location?.lng,
    };
  }

  // Regenerar slug SEO (tipo-titulo-ciudad) cuando cambian título, tipo o ciudad
  let typeSlug = payload.propertyTypeSlug ?? null;
  let citySlug = payload.address?.city ?? null;
  if (!typeSlug || !citySlug) {
    await property.populate("propertyType", "slug");
    await property.populate("address.city", "slug");
    typeSlug = typeSlug ?? (property as any).propertyType?.slug;
    citySlug = citySlug ?? (property as any).address?.city?.slug;
  }
  const titleForSlug = payload.title ?? property.title;
  if (typeSlug && citySlug) {
    let newSlug = buildPropertySeoSlug(typeSlug, titleForSlug, citySlug);
    let slugExists = await PropertyModel.findOne({ slug: newSlug });
    let counter = 1;
    while (slugExists && slugExists._id.toString() !== property._id.toString()) {
      newSlug = `${buildPropertySeoSlug(typeSlug, titleForSlug, citySlug)}-${counter}`;
      slugExists = await PropertyModel.findOne({ slug: newSlug });
      counter++;
    }
    updateData.slug = newSlug;
  }

  // Aplicar cambios
  const oldSlug = property.slug; // Guardar slug viejo antes de guardar
  Object.assign(property, updateData);
  await property.save();

  // Revalidación de paths - revalidar tanto old como new slug
  revalidatePath("/");
  revalidatePath("/propiedades/oportunidad");
  revalidatePath("/propiedades/venta");
  revalidatePath("/propiedades/alquiler");
  revalidatePath(`/propiedad/${oldSlug}`);
  if (updateData.slug && updateData.slug !== oldSlug) {
    revalidatePath(`/propiedad/${updateData.slug}`);
  }

  // Devolver con populate
  const result = await PropertyModel.findById(property._id)
    .populate("propertyType")
    .populate("address.province")
    .populate("address.city")
    .lean();

  return {
    ...result,
    _id: result!._id.toString(),
    address: {
      ...result!.address,
      barrio: result!.address.barrio ?? null, // string directo, puede ser null
    },
  } as any;
}

  // DELETE /properties/:slug
  static async delete(slug: string) {
    const property = await PropertyRepository.findBySlug(slug);
    if (!property) throw new NotFoundError("Property not found");

    await PropertyModel.deleteOne({ _id: property._id });

    // 🔥 INVALIDACIÓN
    revalidatePath("/");
    revalidatePath("/propiedades/oportunidad");
    revalidatePath("/propiedades/venta");
    revalidatePath("/propiedades/alquiler");
    return { message: "Property deleted successfully" };
  }

  //para llamada del SearchBar y llamadas con filtros del home
  static async findByType(type: string, limit = 100) {
    // Definimos los filtros basados en el "type" que viene de la URL
    const filters: any = {};

    if (type === "oportunidad") {
      filters.opportunity = true;
    } else if (type === "venta" || type === "alquiler") {
      filters.operationType = type;
    }

    // Llamamos a tu método findAll existente
    // Ajustamos la paginación y el orden según necesites
    return await this.findAll({
      filters,
      pagination: { page: 1, limit, skip: 0 },
      sort: { sort: { createdAt: -1 } },
    });
  }


  //SEO
  static async findAllForSitemap() {
    return PropertyRepository.findAllForSitemap();
  }

  /** Estructura del menú navegación: operación → tipo → ciudades (solo con propiedades) */
  static async getMenuStructure(): Promise<NavMenuStructure> {
    const rows = await PropertyRepository.getDistinctOperationTypeCity();
    const ventaMap = new Map<string, TypeMenuEntry>();
    const alquilerMap = new Map<string, TypeMenuEntry>();

    for (const r of rows) {
      const op = r.operationType as "venta" | "alquiler";
      if (op !== "venta" && op !== "alquiler") continue;

      const map = op === "venta" ? ventaMap : alquilerMap;
      const key = r.typeSlug;
      if (!map.has(key)) {
        map.set(key, {
          typeSlug: r.typeSlug,
          typeName: r.typeName,
          cities: [],
        });
      }
      const entry = map.get(key)!;
      if (!entry.cities.some((c) => c.slug === r.citySlug)) {
        entry.cities.push({ slug: r.citySlug, name: r.cityName });
      }
    }

    const sortByTypeName = (a: TypeMenuEntry, b: TypeMenuEntry) =>
      a.typeName.localeCompare(b.typeName);

    return {
      venta: Array.from(ventaMap.values()).sort(sortByTypeName),
      alquiler: Array.from(alquilerMap.values()).sort(sortByTypeName),
    };
  }

  /** Nombres de tipo y ciudad para metadata de listados SEO dinámicos */
  static async getSeoListingNames(
    typeSlug: string,
    citySlug: string
  ): Promise<{ typeName: string; cityName: string } | null> {
    await connectDB();
    const [typeDoc, cityDoc] = await Promise.all([
      PropertyTypeRepository.findBySlug(typeSlug),
      City.findOne({ slug: citySlug }).select("name").lean(),
    ]);
    if (!typeDoc || !cityDoc) return null;
    return {
      typeName: typeDoc.name,
      cityName: (cityDoc as { name: string }).name,
    };
  }
}
