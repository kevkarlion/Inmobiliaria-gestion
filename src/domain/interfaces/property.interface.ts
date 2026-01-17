import { OperationType } from "../enums/operation-type.enum";
import { PropertyStatus } from "../enums/property-status.enum";

export interface IProperty {
  title: string;
  slug: string;
  operationType: OperationType;
  propertyType: string;
  zone: string;
  price: {
    amount: number;
    currency: "ARS" | "USD";
  };
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    m2?: number;
    garage?: boolean;
  };
  tags?: string[];
  flags?: {
    featured?: boolean;
    opportunity?: boolean;
    premium?: boolean;
  };
  images?: string[];
  status?: PropertyStatus;
}
