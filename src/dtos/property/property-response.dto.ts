export class PropertyResponseDTO {
  id: string;
  title: string;
  slug: string;
  price: number;
  propertyType: any;
  zone: any;

  constructor(property: any) {
    this.id = property._id.toString();
    this.title = property.title;
    this.slug = property.slug;
    this.price = property.price;
    this.propertyType = property.propertyType;
    this.zone = property.zone;
  }
}
