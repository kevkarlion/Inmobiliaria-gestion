export interface PropertyFormType {
  title: string;
  operationType: string;
  propertyTypeSlug: string;
  contactPhone:string;
  // Ubicación por Entidades (IDs de MongoDB)
  province: string;   // ID Seleccionado
  city: string;       // ID Seleccionado
  barrio?: string;    // ID Seleccionado (opcional)

  priceAmount: number;
  currency: "USD" | "ARS";
  
  // Características
  bedrooms: number;
  bathrooms: number;
  totalM2: number;
  coveredM2: number;
  rooms: number;
  garage: boolean;
  age: number;
  features: string; // Info adicional
  
  // Dirección física
  street: string;
  number: string;
  zipCode: string;
  
  // Geolocalización
  mapsUrl: string;
  lat: number;
  lng: number;

  // Metadata y Estado
  featured: boolean;
  opportunity: boolean;
  premium: boolean;
  tags: string[];
  images: string[];
  description: string;
}