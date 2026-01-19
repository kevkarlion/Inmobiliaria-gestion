import { OperationType } from "../enums/operation-type.enum";
import { PropertyStatus } from "../enums/property-status.enum";

export interface IProperty {
  title: string;
  slug: string;

  operationType: OperationType;

  propertyType: string; // ObjectId (PropertyType)
  zone: string;         // ObjectId (Zone)

  description?: string;

  address?: {
    street?: string;
    number?: string;
    zipCode?: string;
  };

  price: {
    amount: number;
    currency: "ARS" | "USD";
  };

  features?: {
    bedrooms?: number;
    bathrooms?: number;
    totalM2?: number;
    coveredM2?: number;
    rooms?: number;
    garage?: boolean;
  };

  age?: number; // años

  tags?: string[];

  flags?: {
    featured?: boolean;
    opportunity?: boolean;
    premium?: boolean;
  };

  images?: string[];

  status?: PropertyStatus;
}
