/* eslint-disable @typescript-eslint/no-explicit-any */
// backend/mappers/property.mapper.ts
import { PropertyDTO } from "@/dtos/property/property-by-slug.dto";

export function mapPropertyToDTO(doc: any): PropertyDTO {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,

    price: doc.price,

    typeName: doc.propertyType?.name ?? "",
    zoneName: doc.zone?.name ?? "",
    operationType: doc.operationType,

    features: doc.features,

    images: doc.images ?? [],
    mapsUrl: doc.mapsUrl ?? null,
  };
}
