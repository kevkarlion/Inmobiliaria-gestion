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

  // Lógica de filtrado
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (typesSelected.length && !typesSelected.includes(p.typeSlug)) return false;
      if (minPrice !== "" && p.amount < minPrice) return false;
      if (maxPrice !== "" && p.amount > maxPrice) return false;
      if (currency && p.currency !== currency) return false;
      if (minM2 !== "" && p.totalM2 < minM2) return false;
      if (bedrooms !== "" && p.bedrooms < bedrooms) return false;
      if (garage && !p.garage) return false;
      return true;
    });
  }, [properties, typesSelected, minPrice, maxPrice, currency, minM2, bedrooms, garage]);

  // Tipos dinámicos basados en la data
  const types = useMemo(() => [...new Set(properties.map((p) => p.typeSlug))], [properties]);

  // CORRECCIÓN: Monedas forzadas (USD/ARS) + cualquier otra que venga en la data
  const currencies = useMemo(() => {
    const dynamicCurrencies = properties.map((p) => p.currency);
    return [...new Set(["USD", "ARS", ...dynamicCurrencies])].filter(Boolean);
  }, [properties]);

  const getTitle = () => {
    if (filterParam === "venta") return "Propiedades en Venta";
    if (filterParam === "alquiler") return "Propiedades en Alquiler";
    if (filterParam === "oportunidad") return "Oportunidades Destacadas";
    return "Propiedades";
  };

  return (
    <main className="min-h-screen bg-white-bg pb-10 py-14 pt-22 lg:pt-56 lg:pb-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-14 px-4">
        
        {/* BOTÓN MOBILE - Estilo Detail */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full bg-oxford text-white py-4 rounded font-montserrat font-black uppercase tracking-tighter italic mb-4 shadow-lg"
        >
          {showFilters ? "Cerrar Filtros" : "Filtrar Búsqueda"}
        </button>

        {/* SIDEBAR - Estilo Oscuro (basado en Detalle de Propiedad) */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } lg:block lg:w-80 lg:bg-transparent lg:p-0 flex-shrink-0`}
        >
          <div className="bg-oxford p-8 rounded-3xl shadow-2xl w-full text-white border border-white/5">
            <h3 className="font-montserrat text-xl font-black uppercase tracking-tight border-l-4 border-gold-sand pl-4 mb-8 italic text-white">
              Filtros de Búsqueda
            </h3>

            <div className="space-y-8">
              
              {/* Moneda - Estilo Tags */}
              <div className="space-y-3">
                <span className="label-subtitle text-gold-secondary block uppercase text-[10px] tracking-widest font-bold">
                  Moneda
                </span>
                <div className="flex gap-2">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(currency === c ? "" : c)}
                      className={`flex-1 py-2 rounded font-montserrat font-bold text-[10px] uppercase transition-all border ${
                        currency === c
                          ? "bg-gold-sand text-black border-gold-sand shadow-lg"
                          : "bg-white/5 text-white border-white/10 hover:border-gold-sand/50"
                      }`}
                    >
                      {c === "USD" ? "Dólares" : c === "ARS" ? "Pesos" : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Propiedad */}
              <div className="space-y-3">
                <span className="label-subtitle text-gold-secondary block uppercase text-[10px] tracking-widest font-bold">
                  Categoría
                </span>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => 
                        typesSelected.includes(t) 
                          ? setTypesSelected(typesSelected.filter(x => x !== t))
                          : setTypesSelected([...typesSelected, t])
                      }
                      className={`text-[9px] px-3 py-1.5 rounded font-bold uppercase transition-all border ${
                        typesSelected.includes(t)
                          ? "bg-gold-sand text-black border-gold-sand shadow-md"
                          : "bg-white/5 text-white border-white/10 hover:bg-white/20"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rango de Precio */}
              <div className="space-y-3">
                <span className="label-subtitle text-gold-secondary block uppercase text-[10px] tracking-widest font-bold">
                  Rango de Precio
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Mín"
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:border-gold-sand outline-none text-white placeholder:text-white/20 transition-colors"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Máx"
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:border-gold-sand outline-none text-white placeholder:text-white/20 transition-colors"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>
                </div>
              </div>

              {/* Dormitorios */}
              <div className="space-y-3">
                <span className="label-subtitle text-gold-secondary block uppercase text-[10px] tracking-widest font-bold">
                  Dormitorios
                </span>
                <div className="grid grid-cols-5 gap-1">
                  {["", 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setBedrooms(n === "" ? "" : Number(n))}
                      className={`py-2 text-[10px] font-bold rounded border transition-all ${
                        bedrooms === n 
                          ? "bg-gold-sand text-black border-gold-sand" 
                          : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {n === "" ? "Any" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Garage Toggle */}
              <button
                onClick={() => setGarage(!garage)}
                className={`w-full flex justify-between items-center p-3 rounded border transition-all ${
                  garage 
                    ? "bg-gold-sand/20 border-gold-sand text-gold-sand" 
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-tight">Cochera / Garage</span>
                <span className="text-[10px] font-bold">{garage ? "SÍ" : "NO"}</span>
              </button>

              {/* Reset / Limpiar */}
              <button
                onClick={() => {
                  setTypesSelected([]); setMinPrice(""); setMaxPrice("");
                  setCurrency(""); setMinM2(""); setBedrooms(""); setGarage(false);
                }}
                className="w-full text-[9px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-gold-sand transition-colors pt-6 border-t border-white/10 flex justify-center items-center gap-2"
              >
                ✕ Limpiar filtros
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL - RESULTADOS */}
        <div className="flex-1 space-y-10">
          <header className="border-b border-black/10 pb-8">
            <h1 className="font-montserrat text-4xl md:text-6xl font-black uppercase tracking-tight leading-none text-oxford italic">
              {getTitle()}
            </h1>
            <div className="flex items-center gap-4 mt-4">
               <span className="text-xs font-montserrat bg-gold-sand text-black px-3 py-1 rounded font-black uppercase italic">
                  — {filtered.length} Resultados
               </span>
               <div className="h-px bg-black/10 flex-1" />
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <PropertyCardGrid properties={filtered} />
          </div>

          {filtered.length === 0 && !loading && (
            <div className="py-20 text-center">
               <p className="text-blue-gray text-lg font-medium">No se encontraron propiedades con estos filtros.</p>
               <button 
                onClick={() => {
                  setTypesSelected([]); setMinPrice(""); setMaxPrice("");
                  setCurrency(""); setMinM2(""); setBedrooms(""); setGarage(false);
                }}
                className="text-gold-sand font-bold uppercase text-sm mt-4 underline"
               >
                 Ver todas las propiedades
               </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}