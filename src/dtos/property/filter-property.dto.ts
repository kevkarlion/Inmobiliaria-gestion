/* eslint-disable @typescript-eslint/no-explicit-any */
export class PropertyFilterDTO {
  operationType?: string;
  propertyType?: string;
  search?: string;

  // 🔹 NUEVOS CAMPOS DE UBICACIÓN (Slugs)
  province?: string;
  city?: string;
  barrio?: string;

  minPrice?: number;
  maxPrice?: number;

  bedrooms?: number;
  bathrooms?: number;
  minM2?: number;
  maxM2?: number;

  garage?: boolean;

  featured?: boolean;
  premium?: boolean;
  opportunity?: boolean;

  constructor(query: any) {
    // 🔑 STRINGS
    this.operationType = query.operationType && query.operationType !== "" 
      ? query.operationType 
      : undefined;

    this.propertyType = query.propertyType && query.propertyType !== "" 
      ? query.propertyType 
      : undefined;

    this.search = query.search && query.search.trim() !== "" 
      ? query.search.trim() 
      : undefined;

    // 📍 UBICACIONES (Mapeo de Slugs desde la URL)
    this.province = query.province && query.province !== "" 
      ? query.province 
      : undefined;

    this.city = query.city && query.city !== "" 
      ? query.city 
      : undefined;

    this.barrio = query.barrio && query.barrio !== "" 
      ? query.barrio 
      : undefined;

    // 🔢 NUMBERS
    this.minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    this.maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
    this.bedrooms = query.bedrooms ? Number(query.bedrooms) : undefined;
    this.bathrooms = query.bathrooms ? Number(query.bathrooms) : undefined;
    this.minM2 = query.minM2 ? Number(query.minM2) : undefined;
    this.maxM2 = query.maxM2 ? Number(query.maxM2) : undefined;

    // ✅ BOOLEANS (Parsing de strings de URL a booleanos reales)
    const parseBool = (val: any) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return undefined;
    };

    this.garage = parseBool(query.garage);
    this.featured = parseBool(query.featured);
    this.premium = parseBool(query.premium);
    this.opportunity = parseBool(query.opportunity);
  }
}