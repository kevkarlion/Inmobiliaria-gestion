//transformando el "desorden" que viene de internet (body) en un objeto limpio, tipado y organizado que tu servicio de base de datos puede entender sin errores.
export class UpdatePropertyDTO {
  title?: string;
  operationType?: string;
  propertyTypeSlug?: string;
  zoneSlug?: string;
  price?: {
    amount?: number;
    currency?: string;
  };
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    m2?: number;
    garage?: boolean;
  };
  flags?: {
    featured?: boolean;
    premium?: boolean;
    opportunity?: boolean;
  };


  //Asignación Masiva" (Object.assign)
  //Agarra todo lo que viene en data y lo "pega" automáticamente en this.
  constructor(data: Partial<UpdatePropertyDTO>) {
    Object.assign(this, data);
  }
}
