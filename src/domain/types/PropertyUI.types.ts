export interface PropertyUI {
  id: string;
  title: string;
  slug: string;
  operationType: "venta" | "alquiler";
  
  // Categoría
  typeSlug: string;
  typeName: string;
  
  // Ubicación jerárquica
  provinceSlug: string;
  provinceName: string;
  citySlug: string;
  cityName: string;
  barrioSlug: string;
  barrioName: string;
  zoneName: string;

  // Dirección física
  street: string;
  number: string;
  zipCode: string;

  // Precio
  amount: number;
  currency: string;

  // Características
  bedrooms: number;
  bathrooms: number;
  totalM2: number;
  coveredM2: number;
  rooms: number;
  garage: boolean;
  age: number;

  // Estado
  featured: boolean;
  opportunity: boolean;
  premium: boolean;
  status: "active" | "inactive";

  // Contenido
  tags: string[];
  images: string[];
  description: string;

  // Contacto
  contactPhone: string;

  // Geolocalización
  mapsUrl: string;
  externalMapsUrl: string;
  lat: number;
  lng: number;
}
