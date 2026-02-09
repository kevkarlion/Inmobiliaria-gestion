/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo, useState } from "react";
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import PropertyCardGrid from "@/components/shared/PropertyCardGridSearch/PropertyCardGridSearch";

interface Props {
  properties: PropertyUI[];
  filterParam: string;
}

export default function SearchTypePage({ properties, filterParam }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typesSelected, setTypesSelected] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [currency, setCurrency] = useState("");
  const [minM2, setMinM2] = useState<number | "">("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [garage, setGarage] = useState(false);
console.log(properties.length)

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (typesSelected.length && !typesSelected.includes(p.typeSlug))
        return false;
      if (minPrice !== "" && p.amount < minPrice) return false;
      if (maxPrice !== "" && p.amount > maxPrice) return false;
      if (currency && p.currency !== currency) return false;
      if (minM2 !== "" && p.totalM2 < minM2) return false;
      if (bedrooms !== "" && p.bedrooms < bedrooms) return false;
      if (garage && !p.garage) return false;
      return true;
    });
  }, [
    properties,
    typesSelected,
    minPrice,
    maxPrice,
    currency,
    minM2,
    bedrooms,
    garage,
  ]);

  const types = useMemo(
    () => [...new Set(properties.map((p) => p.typeSlug))],
    [properties],
  );
  const currencies = useMemo(
    () => [...new Set(properties.map((p) => p.currency))],
    [properties],
  );

  const getTitle = () => {
    if (filterParam === "venta") return "Propiedades en Venta";
    if (filterParam === "alquiler") return "Propiedades en Alquiler";
    if (filterParam === "oportunidad") return "Oportunidades Destacadas";
    return "Propiedades";
  };

  return (
    <main className="min-h-screen bg-white-bg py-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 px-4">
        {/* BOTÓN MOBILE */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden w-full bg-oxford text-white py-2 rounded-full text-sm"
        >
          Filtros
        </button>

        {/* SIDEBAR */}
        <aside
          className={`${
            showFilters
              ? "fixed inset-0 z-40 p-4 bg-black/40 flex items-center justify-center"
              : "hidden"
          } lg:static lg:block lg:bg-transparent lg:p-0`}
        >
          <div className="bg-white rounded-3xl p-6 space-y-5 w-full max-w-sm lg:w-80 shadow-xl">
            <h2 className="text-xl font-semibold text-oxford">Filtros</h2>

            {/* Tipo */}
            <div className="space-y-2">
              <h3 className="label-subtitle">Tipo</h3>
              {types.map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={typesSelected.includes(t)}
                    onChange={(e) =>
                      e.target.checked
                        ? setTypesSelected((p) => [...p, t])
                        : setTypesSelected((p) => p.filter((x) => x !== t))
                    }
                    className="accent-gold-sand"
                  />
                  {t}
                </label>
              ))}
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <h3 className="label-subtitle">Precio</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="input"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(e.target.value ? Number(e.target.value) : "")
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="input"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(e.target.value ? Number(e.target.value) : "")
                  }
                />
              </div>
            </div>

            {/* Moneda */}
            <div className="space-y-2">
              <h3 className="label-subtitle">Moneda</h3>
              <select
                className="input"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="">Todas</option>
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* M² mínimos */}
            <div className="space-y-2">
              <h3 className="label-subtitle">M² mínimos</h3>
              <input
                type="number"
                placeholder="Ej: 60"
                value={minM2}
                onChange={(e) =>
                  setMinM2(e.target.value ? Number(e.target.value) : "")
                }
                className="input"
              />
            </div>

            {/* Habitaciones */}
            <div className="space-y-2">
              <h3 className="label-subtitle">Habitaciones</h3>
              <select
                value={bedrooms}
                onChange={(e) =>
                  setBedrooms(e.target.value ? Number(e.target.value) : "")
                }
                className="input"
              >
                <option value="">Cualquiera</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
              </select>
            </div>

            {/* Garage */}
            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={garage}
                  onChange={(e) => setGarage(e.target.checked)}
                  className="accent-gold-sand"
                />
                Con garage
              </label>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full bg-oxford text-white py-2 rounded-full"
              >
                Aplicar filtros
              </button>
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
                className="text-xs text-gold-sand underline self-end"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </aside>

        {/* GRID */}
        <div className="flex-1 space-y-6 ">
          <header>
            <h1 className="text-3xl font-bold">{getTitle()}</h1>
            <p className="text-sm text-blue-gray mb-8">
              {filtered.length} propiedades encontradas
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              <PropertyCardGrid properties={undefined} skeletonCount={6} />
            ) : (
              <PropertyCardGrid properties={filtered} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
