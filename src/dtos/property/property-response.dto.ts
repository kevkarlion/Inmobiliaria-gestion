/* eslint-disable @typescript-eslint/no-explicit-any */
export class PropertyResponseDTO {
  id: string;
  title: string;
  slug: string;
  price: any;
  propertyType: any;
  zone: any;

  address?: {
    street?: string;
    number?: string;
    zipCode?: string;
  };

  constructor(property: any) {
    this.id = property._id.toString();
    this.title = property.title;
    this.slug = property.slug;
    this.price = property.price;
    this.propertyType = property.propertyType;
    this.zone = property.zone;
    this.address = property.address;
  }
}
