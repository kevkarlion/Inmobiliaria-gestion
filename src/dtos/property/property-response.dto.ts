/* eslint-disable @typescript-eslint/no-explicit-any */
export class PropertyResponseDTO {
  id: string;
  title: string;
  slug: string;
  price: any;
  propertyType: any;
  zone: any;
  operationType: string;
  address?: {
    street?: string;
    number?: string;
    zipCode?: string;
  };
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    totalM2?: number;
    coveredM2?: number;
    rooms?: number;
    garage?: boolean;
  };
  flags?: {
    featured?: boolean;
    opportunity?: boolean;
    premium?: boolean;
  };
  age?: number;
  tags?: string[];
  images?: string[];
  description?: string;
  status?: string;

  constructor(property: any) {
    this.id = property._id.toString();
    this.title = property.title;
    this.slug = property.slug;
    this.price = property.price;
    this.propertyType = property.propertyType;
    this.zone = property.zone;
    this.operationType = property.operationType;
    this.address = property.address || {};
    this.features = property.features || {};
    this.flags = property.flags || {};
    this.age = property.age;
    this.tags = property.tags || [];
    this.images = property.images || [];
    this.description = property.description;
    this.status = property.status;
  }
}
