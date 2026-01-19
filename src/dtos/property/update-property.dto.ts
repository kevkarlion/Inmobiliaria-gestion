// backend/dto/UpdatePropertyDTO.ts
export class UpdatePropertyDTO {
  title?: string;
  slug?: string;
  operationType?: "venta" | "alquiler";
  propertyTypeSlug?: string;
  zoneSlug?: string;

  address?: {
    street?: string;
    number?: string;
    zipCode?: string;
  };

  price?: {
    amount?: number;
    currency?: "USD" | "ARS";
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

  tags?: string[];
  images?: string[];
  description?: string;
  status?: "active" | "inactive";

  // Asignación masiva segura
  constructor(data: Partial<UpdatePropertyDTO>) {
    Object.assign(this, data);
  }
}
