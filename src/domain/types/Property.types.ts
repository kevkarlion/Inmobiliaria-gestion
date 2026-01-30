// domain/types/Property.types.ts
//interfaz que representa el dato después de ser procesado por tu servidor (luego del .populate()).

export interface Property {
  _id: string; // El ID de la propiedad misma
  title: string;
  slug: string; // Importante para las URLs
  operationType: string;

  // Corregido: Agregamos el _id que viene en tus items reales
  propertyType: {
    _id: string; 
    slug: string;
    name: string;
  };

  zone: {
    _id: string;
    slug: string;
    name: string;
  };

  price: {
    amount: number;
    currency: string;
  };

  features: {
    bedrooms: number;
    bathrooms: number;
    totalM2: number;
    coveredM2: number;
    rooms: number;
    garage: boolean;
  };

  address: {
    street: string;
    number: string;
    zipCode: string;
  };

  flags: {
    featured: boolean;
    opportunity: boolean;
    premium: boolean;
  };

  tags: string[];
  images: string[];
  description: string;
  status: "active" | "inactive";
  createdAt?: string; // Mongoose timestamps
  updatedAt?: string;
}


export interface FindAllPropertiesResult {
  items: Property[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}