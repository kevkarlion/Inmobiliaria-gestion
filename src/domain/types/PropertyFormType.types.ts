// domain/types/PropertyFormType.types.ts
export interface PropertyFormType {
  title: string;
  operationType: string;
  propertyTypeSlug: string;
  zoneSlug: string;
  priceAmount: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  totalM2: number;
  coveredM2: number;
  rooms: number;
  garage: boolean;
  featured: boolean;
  opportunity: boolean;
  premium: boolean;
  street: string;
  number: string;
  zipCode: string;
  tags: string[];
  images: string[];
  description: string;
}
