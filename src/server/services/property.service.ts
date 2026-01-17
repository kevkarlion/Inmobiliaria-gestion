import slugify from "slugify";
import { PropertyRepository } from "../repositories/property.repository";
import { PropertyTypeRepository } from "../repositories/property-type.repository";
import { ZoneRepository } from "../repositories/zone.repository";
import { PropertyModel } from "@/domain/property/property.schema";
import { NotFoundError } from "@/server/errors/http-error";
import { BadRequestError } from "@/server/errors/http-error";

export class PropertyService {
  static async create(payload: any) {
    const { title, operationType, propertyTypeSlug, zoneSlug, ...rest } =
      payload;

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

    return PropertyRepository.create({
      title,
      slug,
      operationType,
      propertyType: propertyType._id,
      zone: zone._id,
      ...rest,
    });
  }

  //findAll contiene la busqueda por filtros
  static async findAll(query: any) {
    const filter: any = { status: "active" };

    if (query.operationType) {
      filter.operationType = query.operationType;
    }

    if (query.search) {
      filter.title = { $regex: query.search, $options: "i" };
    }

    if (query.minPrice || query.maxPrice) {
      filter["price.amount"] = {};
      if (query.minPrice) filter["price.amount"].$gte = Number(query.minPrice);
      if (query.maxPrice) filter["price.amount"].$lte = Number(query.maxPrice);
    }

    if (query.propertyType) {
      const type = await PropertyTypeRepository.findBySlug(query.propertyType);
      if (type) filter.propertyType = type._id;
    }

    if (query.zone) {
      const zone = await ZoneRepository.findBySlug(query.zone);
      if (zone) filter.zone = zone._id;
    }

    if (query.bedrooms) {
      filter["features.bedrooms"] = { $gte: Number(query.bedrooms) };
    }

    if (query.bathrooms) {
      filter["features.bathrooms"] = { $gte: Number(query.bathrooms) };
    }

    if (query.minM2 || query.maxM2) {
      filter["features.m2"] = {};
      if (query.minM2) filter["features.m2"].$gte = Number(query.minM2);
      if (query.maxM2) filter["features.m2"].$lte = Number(query.maxM2);
    }

    if (query.garage) {
      filter["features.garage"] = query.garage === "true";
    }

    const flagKeys = ["featured", "premium", "opportunity"];
    flagKeys.forEach((flag) => {
      if (query[flag]) {
        filter[`flags.${flag}`] = query[flag] === "true";
      }
    });

    const sort =
      query.sortBy === "price"
        ? { "price.amount": query.order === "asc" ? 1 : -1 }
        : { createdAt: -1 };

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    return PropertyRepository.findAll(filter, {
      sort,
      skip,
      limit,
    });
  }

  static async findBySlug(slug: string) {
    const property = await PropertyRepository.findBySlug(slug);
    if (!property) {
      throw new NotFoundError("Property not found");
    }
    return property;
  }
}
