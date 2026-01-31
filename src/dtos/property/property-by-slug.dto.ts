// types/property.dto.ts

export interface PropertyDTO {
  id: string;
  title: string;
  slug: string;
  description?: string;

  price: {
    amount: number;
    currency: "USD" | "ARS";
  };

  typeName: string;
  zoneName: string;
  operationType: string;

  features: {
    bedrooms: number;
    bathrooms: number;
    totalM2: number;
    coveredM2: number;
    rooms: number;
    garage: boolean;
  };

  images: string[];
  mapsUrl?: string;
}
