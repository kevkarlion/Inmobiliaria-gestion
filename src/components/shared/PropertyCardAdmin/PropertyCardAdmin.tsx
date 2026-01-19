/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

export default function PropertyCardAdmin({ property, onDelete, onEdit }: any) {
  return (
    <div className="border p-4 rounded-lg shadow relative">
      {/* FEATURED */}
      {property.flags?.featured && (
        <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs rounded">
          Destacada
        </span>
      )}

      <h2 className="font-semibold text-lg">{property.title}</h2>
      <p className="text-sm text-gray-600">
        {property.operationType === "venta" ? "Venta" : "Alquiler"} - {property.propertyType?.name} - {property.zone?.name}
      </p>
      <p className="text-sm text-gray-600">
        {property.address?.street} {property.address?.number}, {property.address?.zipCode}
      </p>
      {property.features?.totalM2 && <p className="text-sm text-gray-500">{property.features.totalM2} m²</p>}
      <p className="mt-2 font-bold">{property.price.currency} {property.price.amount.toLocaleString("es-AR")}</p>

      {/* Botones */}
      <div className="mt-3 flex gap-2">
        <button
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => onEdit(property)}
        >
          Editar
        </button>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded"
          onClick={() => onDelete(property.slug)}
        >
          Borrar
        </button>
      </div>
    </div>
  );
}
