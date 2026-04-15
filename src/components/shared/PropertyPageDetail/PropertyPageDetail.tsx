import { notFound } from "next/navigation";
import { PropertyService } from "@/server/services/property.service";
import { propertyResponseDTO } from "@/dtos/property/property-response.dto";

interface PropertyPageProps {
  params: { slug: string };
}

export default async function PropertyPageDetail({
  params,
}: PropertyPageProps) {
  // 🔹 Si params es Promise, desestructuramos con await
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 🔹 Buscamos la propiedad directamente en el servicio
  const property = await PropertyService.findBySlug(slug);
  if (!property) notFound();

  // 🔹 Creamos DTO para limpiar y tipar los datos
  const dto =  propertyResponseDTO(property);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* BANNER RESERVADA/VENDIDA - Full width banner */}
      {dto.flags?.reserved && (
        <div className="w-full text-white py-6 text-center -mx-6 -mt-6 mb-6" style={{ backgroundColor: '#67EA81' }}>
          <div className="flex items-center justify-center gap-4 font-montserrat font-black text-3xl uppercase tracking-widest">
            {dto.flags.reservedIsMale ? "RESERVADO" : "RESERVADA"}
          </div>
        </div>
      )}
      {dto.flags?.sold && (
        <div className="w-full text-white py-6 text-center -mx-6 -mt-6 mb-6" style={{ backgroundColor: '#EB4D23' }}>
          <div className="flex items-center justify-center gap-4 font-montserrat font-black text-3xl uppercase tracking-widest">
            {dto.flags.soldIsMale ? "VENDIDO" : "VENDIDA"}
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">{dto.title}</h1>

      {/* FLAGS */}
      {(dto.flags?.featured ||
        dto.flags?.opportunity ||
        dto.flags?.premium) && (
        <div className="flex gap-2 mb-4 text-sm">
          {dto.flags.featured && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded">
              Destacada
            </span>
          )}
          {dto.flags.opportunity && (
            <span className="bg-red-500 text-white px-3 py-1 rounded">
              Oportunidad
            </span>
          )}
          {dto.flags.premium && (
            <span className="bg-purple-600 text-white px-3 py-1 rounded">
              Premium
            </span>
          )}
        </div>
      )}

      <p className="text-lg font-medium mb-2">
        {dto.operationType === "venta" ? "Venta" : "Alquiler"}
      </p>

      {dto.address && (
        <p className="text-gray-700 mb-2">
          {dto.address.street} {dto.address.number}, {dto.address.zipCode}
        </p>
      )}

     

      {dto.features && (
        <div className="text-gray-600 mb-2 space-y-1">
          {dto.features.bedrooms > 0 && <p>Dormitorios: {dto.features.bedrooms}</p>}
          {dto.features.bathrooms > 0 && <p>Baños: {dto.features.bathrooms}</p>}
          {dto.features.rooms > 0 && <p>Ambientes: {dto.features.rooms}</p>}
          {dto.features.totalM2 > 0 && <p>Total m²: {dto.features.totalM2}</p>}
          {dto.features.coveredM2 > 0 && <p>Cubiertos m²: {dto.features.coveredM2}</p>}
          {dto.features.width > 0 && dto.features.length > 0 && <p>Dimensiones: {dto.features.width}m x {dto.features.length}m</p>}
          {dto.features.width > 0 && dto.features.length === 0 && <p>Ancho: {dto.features.width}m</p>}
          {dto.features.width === 0 && dto.features.length > 0 && <p>Largo: {dto.features.length}m</p>}
          {dto.features.garageType && dto.features.garageType !== "ninguno" && (
            <p>{dto.features.garageType === "cochera" ? "Cochera" : "Entrada de vehículo"}: Sí</p>
          )}
          {dto.features.services && dto.features.services.length > 0 && (
            <p>Servicios: {dto.features.services.join(", ")}</p>
          )}
        </div>
      )}

      <p className="text-2xl font-bold mt-4 mb-4">
        {(dto.price.priceOption === "consult" || dto.price.amount === 0) ? (
          <span className="text-green-600">Consultar Precio</span>
        ) : (
          <>
            {dto.price.currency} {dto.price.amount.toLocaleString("es-AR")}
          </>
        )}
      </p>

      {dto.description && (
        <p className="text-gray-800 whitespace-pre-line">{dto.description}</p>
      )}

      {dto.tags && dto.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {dto.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Información de creación */}
      {dto.createdBy && (
        <div className="mt-6 pt-4 border-t text-sm text-gray-500">
          <p>Creado por: <span className="font-medium">{dto.createdBy.email.split('@')[0]}</span></p>
        </div>
      )}
    </div>
  );
}
