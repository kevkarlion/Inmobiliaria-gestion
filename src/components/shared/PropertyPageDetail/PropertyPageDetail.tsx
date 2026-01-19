
import { notFound } from "next/navigation";
import { PropertyService } from "@/server/services/property.service";
import { PropertyResponseDTO } from "@/dtos/property/property-response.dto";

interface PropertyPageProps {
  params: { slug: string };
}

export default async function PropertyPageDetail({ params }: PropertyPageProps) {
  // 🔹 Si params es Promise, desestructuramos con await
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 🔹 Buscamos la propiedad directamente en el servicio
  const property = await PropertyService.findBySlug(slug);
  if (!property) notFound();

  // 🔹 Creamos DTO para limpiar y tipar los datos
  const dto = new PropertyResponseDTO(property);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{dto.title}</h1>

      {dto.flags?.featured && (
        <span className="inline-block bg-yellow-500 text-white px-3 py-1 rounded mb-4">
          Destacada
        </span>
      )}

      <p className="text-lg font-medium mb-2">
        {dto.operationType === "venta" ? "Venta" : "Alquiler"}
      </p>

      {dto.address && (
        <p className="text-gray-700 mb-2">
          {dto.address.street} {dto.address.number}, {dto.address.zipCode}
        </p>
      )}

      <p className="text-gray-600 mb-2">
        Tipo: {dto.propertyType?.name} • Zona: {dto.zone?.name}
      </p>

      {dto.features && (
        <div className="text-gray-600 mb-2 space-y-1">
          <p>Dormitorios: {dto.features.bedrooms}</p>
          <p>Baños: {dto.features.bathrooms}</p>
          <p>Ambientes: {dto.features.rooms}</p>
          <p>Total m²: {dto.features.totalM2}</p>
          <p>Cubiertos m²: {dto.features.coveredM2}</p>
          <p>Garage: {dto.features.garage ? "Sí" : "No"}</p>
        </div>
      )}

      <p className="text-2xl font-bold mt-4 mb-4">
        {dto.price.currency} {dto.price.amount.toLocaleString("es-AR")}
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
    </div>
  );
}
