
export interface PropertyFormType {
  title: string;
  operationType: string;
  propertyTypeSlug: string;
  zoneSlug: string;
  priceAmount: number;
  currency: string; // "USD" | "ARS"
  bedrooms: number;
  bathrooms: number;
  totalM2: number;
  coveredM2: number;
  rooms: number;
  garage: boolean;
  featured: boolean;
  features: string; // Additional info string
  opportunity: boolean;
  premium: boolean;
  street: string;
  number: string;
  zipCode: string;
  mapsUrl: string; // Nuevo
  lat: number;     // Nuevo
  lng: number;     // Nuevo
  tags: string[];
  images: string[];
  description: string;
  age: number;
}