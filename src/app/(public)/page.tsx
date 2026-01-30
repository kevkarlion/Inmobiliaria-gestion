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
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProperties(data.items.map(mapPropertyToUI));
    }
    fetchProperties();
  }, []);

  // ================= FILTRADO =================
  const filtered = useMemo(() => {
    if (
      search.length < 3 &&
      !operation &&
      !type &&
      !zone
    ) return [];

    const q = search.toLowerCase();

    return properties.filter((p) => {
      const matchText =
        !search ||
        [p.title, p.street]
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

  // ================= OPTIONS =================
  const types = useMemo(() => {
    return [...new Set(properties.map((p) => p.typeSlug))];
  }, [properties]);

  const zones = useMemo(() => {
    return [...new Set(properties.map((p) => p.zoneSlug))];
  }, [properties]);

  // ================= UI =================
  return (
    <main className="min-h-screen bg-white p-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* BUSCADOR */}
        <div className="relative">
          <Search className="absolute left-4 top-4 text-gray-400" />
          <input
            className="w-full pl-12 pr-4 py-4 border rounded-xl text-lg shadow"
            placeholder="Buscar por calle o palabra clave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTROS SIEMPRE VISIBLES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Operación
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as Operation)}
              className="w-full border p-3 rounded"
            >
              <option value="">Todas</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Tipo de propiedad
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border p-3 rounded"
            >
              <option value="">Todos</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Zona
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full border p-3 rounded"
            >
              <option value="">Todas</option>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* RESULTADOS */}
        {filtered.length > 0 && (
          <div className="bg-white border rounded-xl shadow">
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
        )}

        {filtered.length === 0 && (search.length >= 3 || operation || type || zone) && (
          <div className="text-center py-10 text-gray-500">
            No se encontraron resultados.
          </div>
        )}
      </div>
    </main>
  );
}
