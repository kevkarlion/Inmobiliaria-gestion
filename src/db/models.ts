/**
 * Este archivo centraliza la importación de todos los modelos de Mongoose
 * para asegurar que sus esquemas se registren correctamente.
 * 
 * IMPORTANTE: Importar este archivo UNA SOLA VEZ al inicio de la aplicación,
 * NO en cada archivo que use modelos.
 */

// Modelos del dominio
import "@/domain/models/User";

// Schemas de la base de datos
import "@/db/schemas/client.schema";
import "@/db/schemas/property.schema";
import "@/db/schemas/requirement.schema";
import "@/db/schemas/province.schema";
import "@/db/schemas/city.schema";
import "@/db/schemas/barrio.schema";
import "@/db/schemas/blog-post.schema";

// Tipos de propiedad
import "@/domain/property-type/property-type.schema";

// Re-exportar para uso conveniente
// export { UserModel } from "@/domain/models/User";
// export { ClientModel } from "@/db/schemas/client.schema";
// export { PropertyModel } from "@/db/schemas/property.schema";
