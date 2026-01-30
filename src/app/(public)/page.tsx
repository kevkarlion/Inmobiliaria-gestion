/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";

type Operation = "" | "venta" | "alquiler";

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyUI[]>([]);
  const [search, setSearch] = useState("");
  const [operation, setOperation] = useState<Operation>("");
  const [type, setType] = useState("");
  const [zone, setZone] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();

        if (data.items && Array.isArray(data.items)) {
          const mapped = data.items.map(mapPropertyToUI);

          // seguridad por si viene alguno sin id
          const safe = mapped.map((p: PropertyUI, index: number) => ({
            ...p,
            id: p.id || `temp-${index}`,
          }));

          setProperties(safe);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    }

    fetchProperties();
  }, []);

  // ================= FILTRADO PROFESIONAL =================
  const filtered = useMemo(() => {
    if (
      search.length < 3 &&
      !operation &&
      !type &&
      !zone
    ) return [];

    const q = search.toLowerCase();

    return properties.filter((p) => {
      // búsqueda por palabras completas
      const matchText =
        !search ||
        [p.title, p.typeName, p.zoneName, p.street]
          .some((f) =>
            f
              ?.toLowerCase()
              .split(" ")
              .some((word) => word.startsWith(q))
          );

      const matchOperation =
        !operation || p.operationType === operation;

      const matchType =
        !type || p.typeSlug === type;

      const matchZone =
        !zone || p.zoneSlug === zone;

      return matchText && matchOperation && matchType && matchZone;
    });
  }, [search, operation, type, zone, properties]);

  // ================= SELECT OPTIONS =================
  const types = useMemo(() => {
    return [...new Set(
      properties
        .map((p) => p.typeSlug)
        .filter(Boolean)
    )];
  }, [properties]);

  const zones = useMemo(() => {
    return [...new Set(
      properties
        .map((p) => p.zoneSlug)
        .filter(Boolean)
    )];
  }, [properties]);

  // ================= UI =================
  return (
    <main className="min-h-screen bg-white p-10">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* INPUT PRINCIPAL */}
        <div className="relative">
          <Search className="absolute left-4 top-4 text-gray-400" />
          <input
            className="w-full pl-12 pr-4 py-4 border rounded-xl text-lg shadow"
            placeholder="Buscar por zona, dirección o tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTROS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as Operation)}
            className="border p-3 rounded"
          >
            <option value="">Operación</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">Tipo</option>
            {types.map((t) => (
              <option key={`type-${t}`} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">Zona</option>
            {zones.map((z) => (
              <option key={`zone-${z}`} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        {/* RESULTADOS */}
        {filtered.length > 0 ? (
          <div className="bg-white border rounded-xl shadow mt-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer"
              >
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-500">
                  {p.typeName} · {p.zoneName} · {p.operationType} · {p.amount} {p.currency}
                </div>
              </div>
            ))}
          </div>
        ) : (
          search.length >= 3 || operation || type || zone ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron propiedades con los filtros aplicados.
            </div>
          ) : null
        )}
      </div>
    </main>
  );
}
