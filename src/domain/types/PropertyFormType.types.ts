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
  priceOption: "amount" | "consult"; // "amount" = monto específico, "consult" = "Consultar Precio"
  currency: "USD" | "ARS";
  
  // Características
  bedrooms: number;
  bathrooms: number;
  totalM2: number;
  coveredM2: number;
  rooms: number;
  garage: boolean;
  garageType: "cochera" | "entrada" | "ninguno";
  width: number;
  length: number;
  age: number;
  services: string[];
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
  imagesDesktop?: string[];
  imagesMobile?: string[];
  description: string;
}