"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { MapPin, Search } from "lucide-react";
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
    <div className="relative w-full mx-auto font-montserrat" ref={containerRef}>
      {/* Contenedor Principal: Reducido el padding para laptops */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl md:rounded-full shadow-2xl border border-white/40 p-1.5 flex flex-col md:flex-row items-center gap-1">
        
        {/* 1. SELECTORES (ARRIBA EN MOBILE) */}
        <div className="flex w-full md:w-auto items-center order-1 md:order-2 border-b md:border-b-0 border-gray-100 mb-1 md:mb-0">
          <select
            value={province}
            onChange={(e) => { setProvince(e.target.value); setCity(""); }}
            className="flex-1 md:w-32 lg:w-36 px-3 py-2.5 bg-transparent text-[12px] lg:text-[13px] font-bold text-slate-900 outline-none cursor-pointer appearance-none rounded-l-2xl md:rounded-none"
          >
            <option value="">Provincia</option>
            <option value="rio-negro">Río Negro</option>
            <option value="neuquen">Neuquén</option>
          </select>

          <div className="hidden md:block w-px h-6 bg-slate-200" />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 md:w-32 lg:w-36 px-3 py-2.5 bg-transparent text-[12px] lg:text-[13px] font-bold text-slate-900 outline-none cursor-pointer appearance-none"
          >
            <option value="">Propiedad</option>
            {propertyTypes.map((t) => (
              <option key={`type-opt-${t.slug}`} value={t.slug}>{t.name}</option>
            ))}
          </select>

          <div className="hidden md:block w-px h-6 bg-slate-200" />

          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="flex-1 md:w-28 lg:w-32 px-3 py-2.5 bg-transparent text-[12px] lg:text-[13px] font-bold text-slate-900 outline-none cursor-pointer appearance-none"
          >
            <option value="">Operación</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        {/* 2. BÚSQUEDA (ABAJO EN MOBILE) */}
        <div className="relative flex-1 w-full order-2 md:order-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="w-full pl-10 pr-4 py-3 bg-transparent text-[13px] lg:text-sm text-slate-900 placeholder:text-slate-400 font-medium outline-none"
            placeholder="Calle, barrio o zona..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Botón Circular: AHORA DORADO */}
        <button className="hidden md:flex order-3 ml-2 p-3 bg-gold-sand text-oxford rounded-full hover:brightness-105 transition-all shadow-md group">
          <Search size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* DROPDOWN DE RESULTADOS */}
      {showDropdown && (
        <div className="absolute top-full mt-3 left-0 w-full bg-white border border-slate-100 rounded-4xl shadow-2xl z-50 max-h-[50vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 text-slate-900">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Resultados</span>
            <span className="text-[10px] font-bold underline decoration-slate-200">{filtered.length} encontrados</span>
          </div>

          <div className="p-2">
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <Link
                  key={`search-item-${p.id}`}
                  href={`/property/${p.slug}`}
                  className="flex items-center gap-4 p-2.5 hover:bg-slate-50 rounded-2xl transition-all group"
                >
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={p.images[0] || "/placeholder.jpg"}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 min-w-0 font-montserrat">
                    <h4 className="text-[13px] font-bold text-slate-900 truncate capitalize">{p.title}</h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-semibold">
                      <MapPin size={10} className="text-slate-400" />
                      {p.street}, {p.cityName}
                    </p>
                  </div>
                  <div className="text-right pr-2 shrink-0">
                    <p className="text-[12px] font-black text-slate-900">
                      {p.currency} {p.amount.toLocaleString("es-AR")}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center font-bold text-slate-400 text-[12px]">
                Sin resultados.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}