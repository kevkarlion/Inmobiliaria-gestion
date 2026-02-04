"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";

export default function SearchTypePage() {
  const params = useParams();
  const filterParam = params.filter as string;

  const [properties, setProperties] = useState<PropertyUI[]>([]);

  // Filtros
  const [typesSelected, setTypesSelected] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [currency, setCurrency] = useState("");
  const [minM2, setMinM2] = useState<number | "">("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [garage, setGarage] = useState(false);

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
    return properties.filter((p) => {
      // Filtro principal
      if (filterParam === "venta" || filterParam === "alquiler") {
        if (p.operationType !== filterParam) return false;
      }

      if (filterParam === "oportunidad") {
        if (!p.opportunity) return false;
      }

      // Tipo
      if (
        typesSelected.length > 0 &&
        !typesSelected.includes(p.typeSlug)
      )
        return false;

      // Precio
      if (minPrice !== "" && p.amount < minPrice) return false;
      if (maxPrice !== "" && p.amount > maxPrice) return false;

      // Moneda
      if (currency && p.currency !== currency) return false;

      // M2
      if (minM2 !== "" && p.totalM2 < minM2) return false;

      // Habitaciones
      if (bedrooms !== "" && p.bedrooms < bedrooms) return false;

      // Garage
      if (garage && !p.garage) return false;

      return true;
    });
  }, [
    properties,
    filterParam,
    typesSelected,
    minPrice,
    maxPrice,
    currency,
    minM2,
    bedrooms,
    garage,
  ]);

  // ================= OPCIONES =================
  const types = useMemo(
    () => [...new Set(properties.map((p) => p.typeSlug))],
    [properties]
  );

  const currencies = useMemo(
    () => [...new Set(properties.map((p) => p.currency))],
    [properties]
  );

  const getTitle = () => {
    if (filterParam === "venta") return "Propiedades en Venta";
    if (filterParam === "alquiler") return "Propiedades en Alquiler";
    if (filterParam === "oportunidad") return "Oportunidades Destacadas";
    return "Propiedades";
  };

  return (
    <main className="min-h-screen bg-white p-10">
      <div className="max-w-7xl mx-auto flex gap-10">

        {/* SIDEBAR */}
        <aside className="w-72 border rounded-xl p-5 shadow-sm space-y-6">

          <h2 className="text-lg font-semibold">
            Filtros
          </h2>

          {/* Tipo */}
          <div>
            <h3 className="font-medium mb-2">Tipo</h3>
            {types.map((t) => (
              <label key={t} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={typesSelected.includes(t)}
                  onChange={(e) =>
                    e.target.checked
                      ? setTypesSelected((p) => [...p, t])
                      : setTypesSelected((p) =>
                          p.filter((x) => x !== t)
                        )
                  }
                />
                {t}
              </label>
            ))}
          </div>

          {/* Precio */}
          <div>
            <h3 className="font-medium mb-2">Precio</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                className="w-1/2 border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                className="w-1/2 border p-2 rounded"
              />
            </div>
          </div>

          {/* Moneda */}
          <div>
            <h3 className="font-medium mb-2">Moneda</h3>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Todas</option>
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* M2 */}
          <div>
            <h3 className="font-medium mb-2">M2 mínimos</h3>
            <input
              type="number"
              placeholder="Ej: 60"
              value={minM2}
              onChange={(e) =>
                setMinM2(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Habitaciones */}
          <div>
            <h3 className="font-medium mb-2">Habitaciones</h3>
            <select
              value={bedrooms}
              onChange={(e) =>
                setBedrooms(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              className="w-full border p-2 rounded"
            >
              <option value="">Cualquiera</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
            </select>
          </div>

          {/* Garage */}
          <label className="flex gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={garage}
              onChange={(e) => setGarage(e.target.checked)}
            />
            Con garage
          </label>

          {/* Reset */}
          <button
            onClick={() => {
              setTypesSelected([]);
              setMinPrice("");
              setMaxPrice("");
              setCurrency("");
              setMinM2("");
              setBedrooms("");
              setGarage(false);
            }}
            className="text-xs text-blue-600 underline"
          >
            Limpiar filtros
          </button>
        </aside>

        {/* CONTENIDO */}
        <div className="flex-1 space-y-6">
          <header>
            <h1 className="text-2xl font-bold">{getTitle()}</h1>
            <p className="text-gray-500">
              {filtered.length} propiedades encontradas
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="border rounded-xl p-4 hover:shadow transition"
              >
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-500">
                  {p.typeName} · {p.zoneName}
                </div>
                <div className="text-sm mt-2">
                  {p.operationType} · {p.amount} {p.currency}
                </div>
                <div className="text-xs mt-2 text-gray-400">
                  {p.bedrooms} hab · {p.totalM2} m²
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
