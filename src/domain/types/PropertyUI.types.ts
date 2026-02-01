export interface PropertyUI {
  id: string;
  title: string;
  slug: string;
  operationType: "venta" | "alquiler";
  
  // Categoría y Ubicación (Slugs para filtros y Nombres para mostrar)
  typeSlug: string;
  typeName: string;
  
  // 🔹 Nuevos campos de ubicación jerárquica
  provinceSlug: string;
  provinceName: string;
  citySlug: string;
  cityName: string;
  zoneName: string; // Para mostrar ej: "General Roca, Río Negro"

  // Dirección física
  street: string;
  number: string;
  zipCode: string;

  // Precio y Moneda
  amount: number;
  currency: string;

  // Características y Medidas
  bedrooms: number;
  bathrooms: number;
  totalM2: number;
  coveredM2: number;
  rooms: number;
  garage: boolean;
  age: number;

  // Estado y Visibilidad
  featured: boolean;
  opportunity: boolean;
  premium: boolean;
  status: "active" | "inactive";

  // Contenido Multimedia y Texto
  tags: string[];
  images: string[];
  description: string;

  // Geolocalización
  mapsUrl: string;
  externalMapsUrl: string;
  lat: number;
  lng: number;
}