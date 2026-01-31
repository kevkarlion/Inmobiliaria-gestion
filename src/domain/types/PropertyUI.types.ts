// domain/types/PropertyUI.types.ts
// Tipo optimizado para la UI

export interface PropertyUI {
  id: string;
  title: string;
  operationType: "venta" | "alquiler";
  typeSlug: string;
  typeName: string;
  zoneSlug: string;
  zoneName: string;
  slug: string;
  street: string;
  number: string;
  zipCode: string;
  amount: number;
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
  tags: string[];
  images: string[];
  status: "active" | "inactive";
    // 🔥 lo que te interesa para la UI
  mapsUrl: string | null; // ← importante
  lat: number;
  lng: number;
}
