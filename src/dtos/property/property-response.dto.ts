// domain/dtos/PropertyResponse.dto.ts
import { Property } from "@/domain/types/Property.types";

export class PropertyResponseDTO {
  id: string;
  title: string;
  slug: string;
  price: Property["price"];         // Extrae el tipo directamente de la interfaz
  propertyType: Property["propertyType"]; 
  zone: Property["zone"];
  operationType: string;
  address: Property["address"];
  features: Property["features"];
  flags: Property["flags"];
  tags: string[];
  images: string[];
  description?: string;
  status?: string;

  constructor(property: Property) { // <--- Aquí usamos la interfaz de "dato cocinado"
    this.id = property._id.toString();
    this.title = property.title;
    this.slug = property.slug;
    this.price = property.price;
    this.propertyType = property.propertyType;
    this.zone = property.zone;
    this.operationType = property.operationType;
    this.address = property.address;
    this.features = property.features;
    this.flags = property.flags;
    this.tags = property.tags || [];
    this.images = property.images || [];
    this.description = property.description;
    this.status = property.status;
  }
}