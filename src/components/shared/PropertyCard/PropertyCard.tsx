/* eslint-disable @typescript-eslint/no-explicit-any */
// app/properties/PropertyCard.tsx

import Link from "next/link";

export default function PropertyCard({ property }: any) {
  console.log("property", property);

  return (
    <Link href={`/properties/${property.slug}`}>
      <div className="relative border p-4 rounded-lg hover:shadow-md transition">

        {/* ⭐ FEATURED */}
        {property.flags?.featured && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Destacada
          </span>
        )}

        {/* TÍTULO */}
        <h2 className="font-semibold text-lg leading-tight">
          {property.title}
        </h2>

        {/* OPERACIÓN */}
        {property.operationType && (
          <p className="text-sm font-medium text-blue-600 mt-1">
            {property.operationType === "venta" ? "Venta" : "Alquiler"}
          </p>
        )}

        {/* DIRECCIÓN */}
        {(property.address?.street || property.zone?.name) && (
          <p className="text-sm text-gray-600 mt-1">
            {property.address?.street
              ? `${property.address.street} ${property.address.number ?? ""}`
              : ""}
            {property.zone?.name ? ` • ${property.zone.name}` : ""}
          </p>
        )}

        {/* TIPO DE PROPIEDAD */}
        {property.propertyType?.name && (
          <p className="text-sm text-gray-500 mt-1">
            Tipo: {property.propertyType.name}
          </p>
        )}

        {/* METROS */}
        {property.features?.totalM2 && (
          <p className="text-sm text-gray-500 mt-1">
            {property.features.totalM2} m²
          </p>
        )}

        {/* PRECIO */}
        {property.price && (
          <p className="mt-3 font-bold text-lg">
            {property.price.currency}{" "}
            {property.price.amount.toLocaleString("es-AR")}
          </p>
        )}
      </div>
    </Link>
  );
}
