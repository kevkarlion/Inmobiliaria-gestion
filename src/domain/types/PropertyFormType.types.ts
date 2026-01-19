export interface PropertyFormType {
  title: string;
  operationType: string;
  propertyTypeSlug: string;
  zoneSlug: string;
  price: { amount: number; currency: string };
  features: {
    bedrooms: number;
    bathrooms: number;
    totalM2: number;
    coveredM2: number;
    rooms: number;
    garage: boolean;
  };
  flags: {
    featured: boolean;
    opportunity: boolean;
    premium: boolean;
  };
  address: { street: string; number: string; zipCode: string };
  age: number;
  tags: string[];
  images: string[];
  description: string;
  status?: "active" | "inactive"; // <- agregamos status opcional
}
