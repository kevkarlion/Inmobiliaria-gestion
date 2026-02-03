"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { MapPin, ChevronRight, Search } from "lucide-react";
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import Link from "next/link";

export default function SearchBar() {
  const [properties, setProperties] = useState<PropertyUI[]>([]);
  const [search, setSearch] = useState("");
  const [operation, setOperation] = useState("");
  const [type, setType] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProperties() {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProperties(data.items.map(mapPropertyToUI));
    }
    fetchProperties();
  }, []);

  const filtered = useMemo(() => {
    if (!search && !operation && !type && !province && !city) return [];
    const q = search.toLowerCase().trim();
    return properties.filter((p) => {
      const matchText = !q || p.title.toLowerCase().includes(q) || p.street.toLowerCase().includes(q);
      const matchOp = !operation || p.operationType === operation;
      const matchType = !type || p.typeSlug === type;
      const matchProv = !province || p.provinceSlug === province;
      const matchCity = !city || p.citySlug === city;
      return matchText && matchOp && matchType && matchProv && matchCity;
    });
  }, [search, operation, type, province, city, properties]);

  const propertyTypes = useMemo(() => {
    const uniqueSlugs = Array.from(new Set(properties.map((p) => p.typeSlug))).filter(Boolean);
    return uniqueSlugs.map((slug) => ({
      slug,
      name: properties.find((p) => p.typeSlug === slug)?.typeName || slug,
    }));
  }, [properties]);

  const showDropdown = isFocused && (search.length > 0 || operation || type || province || city);

  return (
    <div className="relative w-full max-w-5xl mx-auto font-montserrat" ref={containerRef}>
      {/* Contenedor Principal */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl md:rounded-full shadow-2xl border border-white/40 p-2 flex flex-col md:flex-row items-center gap-1">
        
        {/* 1. SELECTORES (ARRIBA EN MOBILE) */}
        <div className="flex w-full md:w-auto items-center order-1 md:order-2 border-b md:border-b-0 border-gray-100 mb-1 md:mb-0">
          <select
            value={province}
            onChange={(e) => { setProvince(e.target.value); setCity(""); }}
            className="flex-1 md:w-36 px-4 py-3 bg-transparent text-[13px] font-bold text-slate-900 outline-none cursor-pointer appearance-none hover:bg-slate-50 transition-colors rounded-l-2xl md:rounded-none"
          >
            <option value="">Provincia</option>
            <option value="rio-negro">Río Negro</option>
            <option value="neuquen">Neuquén</option>
          </select>

          <div className="hidden md:block w-px h-8 bg-slate-200" />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 md:w-36 px-4 py-3 bg-transparent text-[13px] font-bold text-slate-900 outline-none cursor-pointer appearance-none hover:bg-slate-50 transition-colors"
          >
            <option value="">Propiedad</option>
            {propertyTypes.map((t) => (
              <option key={`type-opt-${t.slug}`} value={t.slug}>{t.name}</option>
            ))}
          </select>

          <div className="hidden md:block w-px h-8 bg-slate-200" />

          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="flex-1 md:w-32 px-4 py-3 bg-transparent text-[13px] font-bold text-slate-900 outline-none cursor-pointer appearance-none hover:bg-slate-50 transition-colors"
          >
            <option value="">Operación</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        {/* 2. BÚSQUEDA (ABAJO EN MOBILE) */}
        <div className="relative flex-1 w-full order-2 md:order-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="w-full pl-12 pr-4 py-4 md:py-3 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 font-medium outline-none"
            placeholder="Calle, barrio o zona..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Botón Circular (Desktop) */}
        <button className="hidden md:flex order-3 ml-2 p-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-lg">
          <Search size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* DROPDOWN DE RESULTADOS */}
      {showDropdown && (
        <div className="absolute top-full mt-4 left-0 w-full bg-white border border-slate-100 rounded-4xl shadow-2xl z-50 max-h-[60vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resultados</span>
            <span className="text-[10px] font-bold text-slate-900 underline decoration-slate-200">{filtered.length} encontrados</span>
          </div>

          <div className="p-2">
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <Link
                  key={`search-item-${p.id}`}
                  href={`/property/${p.slug}`}
                  className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group"
                >
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                    <Image
                      src={p.images[0] || "/placeholder.jpg"}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-slate-900 truncate capitalize">{p.title}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-semibold">
                      <MapPin size={12} className="text-slate-400" />
                      {p.street}, {p.cityName}
                    </p>
                  </div>
                  <div className="text-right pr-2 shrink-0">
                    <p className="text-[13px] font-black text-slate-900">
                      {p.currency} {p.amount.toLocaleString("es-AR")}
                    </p>
                    <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] uppercase font-black text-slate-900 tracking-tighter">Ficha</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center font-bold text-slate-400 text-sm">
                Sin resultados. Intentá con otros filtros.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}