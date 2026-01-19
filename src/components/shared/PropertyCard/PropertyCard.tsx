/* eslint-disable @typescript-eslint/no-explicit-any */
// app/properties/PropertyCard.tsx

import Link from "next/link";

export default function PropertyCard({ property }: any) {
  return (
    <Link href={`/properties/${property.slug}`}>
      <div className="relative border p-4 rounded-lg bg-white text-black dark:bg-neutral-900 dark:text-white">

        {/* FEATURED */}
        {property.flags?.featured && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Destacada
          </span>
        )}

        {/* TÍTULO */}
        <h2 className="font-semibold text-lg mb-1">{property.title}</h2>

        {/* OPERACIÓN */}
        {property.operationType && (
          <p className={`text-sm font-medium mb-1 ${property.operationType === "venta" ? "text-green-600" : "text-blue-600"}`}>
            {property.operationType === "venta" ? "Venta" : "Alquiler"}
          </p>
        )}

        {/* DIRECCIÓN */}
        {(property.address?.street || property.zone?.name) && (
          <p className="text-sm text-gray-600 mb-1">
            {property.address?.street
              ? `${property.address.street} ${property.address.number ?? ""}`
              : ""}
            {property.zone?.name ? ` • ${property.zone.name}` : ""}
          </p>
        )}

        {/* TIPO DE PROPIEDAD */}
        {property.propertyType?.name && (
          <p className="text-sm text-gray-500 mb-1">Tipo: {property.propertyType.name}</p>
        )}

        {/* FEATURES */}
        <p className="text-sm text-gray-500 mb-1">
          {property.features?.bedrooms !== undefined && <>Dorms: {property.features.bedrooms} </>}
          {property.features?.bathrooms !== undefined && <> • Baños: {property.features.bathrooms} </>}
          {property.features?.rooms !== undefined && <> • Amb.: {property.features.rooms} </>}
          {property.features?.garage && <> • Garage</>}
        </p>

        {/* METROS */}
        {(property.features?.totalM2 || property.features?.coveredM2) && (
          <p className="text-sm text-gray-500 mb-1">
            {property.features.totalM2 && <>Total: {property.features.totalM2} m²</>}
            {property.features.coveredM2 && <> • Cubiertos: {property.features.coveredM2} m²</>}
          </p>
        )}

        {/* PRECIO */}
        {property.price && (
          <p className="font-bold text-lg mt-2">
            {property.price.currency} {property.price.amount.toLocaleString("es-AR")}
          </p>
        )}
      </div>
    </Link>
  );
}
