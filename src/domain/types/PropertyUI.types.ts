// domain/types/PropertyUI.types.ts
// Tipo optimizado para la UI y consumo de componentes React

export interface PropertyUI {
  id: string;
  title: string;
  slug: string;
  operationType: "venta" | "alquiler";
  
  // Categoría y Ubicación (Nombres para mostrar)
  typeSlug: string;
  typeName: string;
  zoneSlug: string;
  zoneName: string;

  // Dirección física
  street: string;
  number: string;
  zipCode: string;

  // Precio y Moneda
  amount: number;
  currency: string; // "USD" | "ARS"

  // Características y Medidas
  bedrooms: number;
  bathrooms: number;
  totalM2: number;
  coveredM2: number;
  rooms: number;
  garage: boolean;
  age: number;        // ✨ Añadido para antigüedad

  // Estado y Visibilidad
  featured: boolean;
  opportunity: boolean;
  premium: boolean;
  status: "active" | "inactive";

  // Contenido Multimedia y Texto
  tags: string[];
  images: string[];
  description: string; // ✨ Añadido para el detalle

  // Geolocalización
  mapsUrl: string | null;
  lat: number;
  lng: number;
}