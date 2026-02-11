// domain/types/Property.types.ts

/**
 * Representa la propiedad procesada y lista para el Frontend.
 * Es el resultado de aplicar .populate() y los mappers.
 */
export interface Property {
  _id: string; 
  title: string;
  slug: string; 
  operationType: string;
  
  propertyType: {
    _id: string; 
    slug: string;
    name: string;
  };

  // Reemplazamos zone por la estructura jerárquica poblada
  address: {
    street: string;
    number: string;
    zipCode: string;
    province: {
      _id: string;
      slug: string;
      name: string;
    };
    city: {
      _id: string;
      slug: string;
      name: string;
    };
    barrio?: { // Opcional, puede no tener barrio
      _id: string;
      slug: string;
      name: string;
    };
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
    age: number;
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
  
  location: {
    mapsUrl: string;
    lat: number;
    lng: number;
  };

  createdAt?: string; 
  updatedAt?: string;
}

/**
 * Formato de respuesta para listados paginados
 */
export interface FindAllPropertiesResult {
  items: Property[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}