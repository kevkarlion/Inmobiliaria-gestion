import { Property } from "@/domain/types/Property.types";

export class PropertyResponseDTO {
  id: string;
  title: string;
  slug: string;
  price: Property["price"];
  propertyType: Property["propertyType"];
  operationType: string;
  address: Property["address"]; // 👈 Ahora incluye province, city y barrio poblados
  features: Property["features"];
  flags: Property["flags"];
  tags: string[];
  images: string[];
  description?: string;
  status?: string;
  location: Property["location"];
  age?: number; // Añade esto

  constructor(property: Property) {
    // Usamos property._id porque viene del .lean() del service
    this.id = property._id.toString();
    this.title = property.title;
    this.slug = property.slug;
    this.price = {
      amount: property.price.amount,
      currency: property.price.currency,
    };
    this.propertyType = {
      _id: property.propertyType._id.toString(),
      name: property.propertyType.name,
      slug: property.propertyType.slug,
    };
    this.operationType = property.operationType;

    // Mapeo dinámico de address (trae los nombres de provincia/ciudad gracias al populate)
    this.address = {
      street: property.address.street,
      number: property.address.number,
      zipCode: property.address.zipCode,
      province: property.address.province,
      city: property.address.city,
      barrio: property.address.barrio, // Si es undefined, se mantiene así
    };

    this.features = property.features;
    this.flags = property.flags;
    this.tags = property.tags || [];
    this.images = property.images || [];
    this.description = property.description;
    this.status = property.status;
    this.location = {
      mapsUrl: property.location?.mapsUrl || "",
      lat: property.location?.lat || 0,
      lng: property.location?.lng || 0,
    };
  }
}
