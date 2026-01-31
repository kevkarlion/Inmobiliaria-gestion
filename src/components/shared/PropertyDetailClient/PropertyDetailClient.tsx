"use client";

import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import { PropertyGallery } from "@/components/shared/PropertyGalllery/PropertyGallery";
import { PropertyResponseDTO } from "@/dtos/property/property-response.dto";

//formateo de precio para evitar problemas de hydratacion
import { formatPrice } from '@/utils/formatPrice'


export function PropertyDetailClient({ property }: { property: PropertyResponseDTO }) {
  const p = mapPropertyToUI(property);
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{p.title}</h1>

      <PropertyGallery images={p.images}  />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div className="md:col-span-2 space-y-4">
          <p className="text-xl font-semibold">
            {p.currency} {formatPrice(p.amount)}

          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Item label="Tipo" value={p.typeName} />
            <Item label="Zona" value={p.zoneName} />
            <Item label="Operación" value={p.operationType} />
            <Item label="Habitaciones" value={p.rooms} />
            <Item label="Baños" value={p.bathrooms} />
            <Item label="Garage" value={p.garage ? "Sí" : "No"} />
          </div>
        </div>

        {p.mapsUrl && (
          <div className="w-full h-96 rounded-xl overflow-hidden border">
            <iframe src={p.mapsUrl} className="w-full h-full" loading="lazy" />
          </div>
        )}
      </div>
    </section>
  );

  function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

}
