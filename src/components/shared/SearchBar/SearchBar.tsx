"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import Link from "next/link";

interface SearchBarProps {
  initialProperties: PropertyUI[];
}

export default function SearchBar({ initialProperties }: SearchBarProps) {
  // --- Estados de Filtro ---
  const [search, setSearch] = useState("");
  const [operation, setOperation] = useState("");
  const [type, setType] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  
  // --- UI States ---
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- LÓGICA DE FILTRADO (Client Side) ---
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    // Si no hay criterios de búsqueda, no mostramos nada en el dropdown
    if (q.length < 3 && !operation && !type && !province && !city) {
      return [];
    }

    const words = q.split(" ");

    return initialProperties.filter((p) => {
      const haystack = `${p.title} ${p.street} ${p.cityName} ${p.provinceName}`.toLowerCase();

      // Buscamos coincidencia de palabras (Full text search local)
      const matchText =
        q.length < 3
          ? true
          : words.every((word) =>
              haystack.split(" ").some((token) => token.startsWith(word)),
            );

      const matchOp = !operation || p.operationType === operation;
      const matchType = !type || p.typeSlug === type;
      const matchProv = !province || p.provinceSlug === province;
      const matchCity = !city || p.citySlug === city;

      return matchText && matchOp && matchType && matchProv && matchCity;
    });
  }, [search, operation, type, province, city, initialProperties]);

  // --- OBTENER TIPOS DE PROPIEDAD DINÁMICOS ---
  const propertyTypes = useMemo(() => {
    const uniqueSlugs = Array.from(
      new Set(initialProperties.map((p) => p.typeSlug))
    ).filter(Boolean);
    
    return uniqueSlugs.map((slug) => ({
      slug,
      name: initialProperties.find((p) => p.typeSlug === slug)?.typeName || slug,
    }));
  }, [initialProperties]);

  const showDropdown =
    isFocused && (search.length > 0 || operation || type || province || city);

  return (
    <div ref={containerRef} className="relative w-full mx-auto font-montserrat">
      {/* BARRA PRINCIPAL */}
      <div className="bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-white/40 p-1 md:p-1.5 flex flex-col md:flex-row items-center gap-1">
        
        {/* SELECTORES */}
        <div className="flex w-full md:w-auto items-center order-1 md:order-2 border-b md:border-b-0 border-gray-100 overflow-hidden">
          <select
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              setCity("");
            }}
            className="w-25 md:w-32 px-3 py-3 bg-transparent text-sm font-black uppercase tracking-tighter outline-none cursor-pointer"
          >
            <option value="">Pcia.</option>
            <option value="rio-negro">RN</option>
            <option value="neuquen">Nqn</option>
          </select>

          <div className="w-px h-6 bg-slate-200" />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-35 md:w-32 px-3 py-3 bg-transparent text-sm font-black uppercase tracking-tighter outline-none cursor-pointer"
          >
            <option value="">Tipo</option>
            {propertyTypes.map((t) => (
              <option key={t.slug} value={t.slug}>{t.name}</option>
            ))}
          </select>

          <div className="w-px h-6 bg-slate-200" />

          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-35 md:w-32 px-3 py-3 bg-transparent text-sm font-black uppercase tracking-tighter outline-none cursor-pointer"
          >
            <option value="">Operación</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        {/* INPUT DE BÚSQUEDA */}
        <div className="relative flex-1 w-full order-2 md:order-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="w-full pl-10 pr-4 py-3 bg-transparent text-sm font-bold uppercase tracking-tighter outline-none"
            placeholder="Calle, barrio o zona..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="hidden md:flex order-3 ml-2 p-3 bg-gold-sand text-slate-900 rounded-full shadow-md hover:bg-gold-hover transition-colors">
          <Search size={18} strokeWidth={3} />
        </button>
      </div>

      {/* DROPDOWN FLOTANTE */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] z-50 max-h-96 overflow-y-auto border border-slate-100">
          <div className="px-6 py-4 border-b flex justify-between bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Resultados</span>
            <span className="text-[10px] font-bold text-gold-sand">{filtered.length} encontrados</span>
          </div>

          <div className="p-2">
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <Link
                  key={p.id}
                  href={`/property/${p.slug}`}
                  className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors group"
                >
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={p.images[0] || "/placeholder.jpg"}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black uppercase truncate group-hover:text-gold-sand transition-colors">
                      {p.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">
                      {p.street} {p.number}
                    </p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wide">
                      {p.cityName}, {p.provinceName}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-oxford">
                      {p.currency} {p.amount.toLocaleString("es-AR")}
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