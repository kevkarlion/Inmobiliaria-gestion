"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
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
      const matchText =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.street.toLowerCase().includes(q);
      const matchOp = !operation || p.operationType === operation;
      const matchType = !type || p.typeSlug === type;
      const matchProv = !province || p.provinceSlug === province;
      const matchCity = !city || p.citySlug === city;
      return matchText && matchOp && matchType && matchProv && matchCity;
    });
  }, [search, operation, type, province, city, properties]);

  const propertyTypes = useMemo(() => {
    const uniqueSlugs = Array.from(
      new Set(properties.map((p) => p.typeSlug))
    ).filter(Boolean);
    return uniqueSlugs.map((slug) => ({
      slug,
      name:
        properties.find((p) => p.typeSlug === slug)?.typeName || slug,
    }));
  }, [properties]);

  const showDropdown =
    isFocused &&
    (search.length > 0 || operation || type || province || city);

  return (
    <div
      className="relative w-full mx-auto font-montserrat overflow-x-hidden"
      ref={containerRef}
    >
      {/* Contenedor Principal */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl md:rounded-full shadow-2xl border border-white/40 p-1 md:p-1.5 flex flex-col md:flex-row items-center gap-1">
        
        {/* 1. SELECTORES */}
        <div className="flex w-full md:w-auto items-center order-1 md:order-2 border-b md:border-b-0 border-gray-100">
          
          <select
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              setCity("");
            }}
            className="
              flex-1 min-w-0 md:w-32 lg:w-36
              px-2 md:px-3
              py-3.5 md:py-3
              bg-transparent
              text-[16px] md:text-[13px]
              font-black
              leading-none
              text-slate-900
              outline-none
              cursor-pointer
              appearance-none
              uppercase
              tracking-tighter
              truncate
            "
          >
            + <option value="">Pcia.</option>
            <option value="rio-negro">RN</option>
            <option value="neuquen">Nqn</option>
          </select>

          <div className="w-px h-4 md:h-6 bg-slate-200" />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="
              flex-1 min-w-0 md:w-32 lg:w-36
              px-2 md:px-3
              py-3.5 md:py-3
              bg-transparent
              text-[16px] md:text-[13px]
              font-black
              leading-none
              text-slate-900
              outline-none
              cursor-pointer
              appearance-none
              uppercase
              tracking-tighter
              truncate
            "
          >
            <option value="">Tipo</option>
            {propertyTypes.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>

          <div className="w-px h-4 md:h-6 bg-slate-200" />

          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="
              flex-1 min-w-0 md:w-28 lg:w-32
              px-2 md:px-3
              py-3.5 md:py-3
              bg-transparent
              text-[16px] md:text-[13px]
              font-black
              leading-none
              text-slate-900
              outline-none
              cursor-pointer
              appearance-none
              uppercase
              tracking-tighter
              truncate
            "
          >
            <option value="">Operación</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        {/* 2. BÚSQUEDA */}
        <div className="relative flex-1 min-w-0 w-full order-2 md:order-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
          <input
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="
              w-full
              pl-10 pr-4
              py-3.5 md:py-3
              bg-transparent
              text-[16px] md:text-sm
              font-bold
              leading-none
              text-slate-900
              placeholder:text-slate-400
              outline-none
              uppercase
              tracking-tighter
            "
            placeholder="Calle, barrio o zona..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="hidden md:flex order-3 ml-2 p-3 bg-gold-sand text-slate-900 rounded-full hover:scale-105 transition-all shadow-md">
          <Search size={18} strokeWidth={3} />
        </button>
      </div>

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-100 max-h-100 overflow-y-auto border border-slate-100">
          <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Resultados
            </span>
            <span className="text-[10px] font-bold text-gold-sand">
              {filtered.length} encontrados
            </span>
          </div>

          <div className="p-2">
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <Link
                  key={p.id}
                  href={`/property/${p.slug}`}
                  className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group"
                >
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                    <Image
                      src={p.images[0] || "/placeholder.jpg"}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-black text-slate-900 uppercase leading-none truncate">
                      {p.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 truncate font-medium">
                      {p.cityName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-black text-slate-900">
                      {p.currency}{" "}
                      {p.amount.toLocaleString("es-AR")}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                No se hallaron coincidencias
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
