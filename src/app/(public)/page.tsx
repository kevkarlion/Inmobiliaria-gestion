"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  Tag,
  Home,
  ChevronRight,
  X,
  Globe,
} from "lucide-react";
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import Link from "next/link";

export default function HomePage() {
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
      new Set(properties.map((p) => p.typeSlug)),
    ).filter(Boolean);
    return uniqueSlugs.map((slug) => ({
      slug,
      name: properties.find((p) => p.typeSlug === slug)?.typeName || slug,
    }));
  }, [properties]);

  const showDropdown =
    isFocused && (search.length > 0 || operation || type || province || city);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-16 px-6">
      <div className="w-full max-w-4xl mx-auto space-y-8" ref={containerRef}>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900">
            ¿Qué estás <span className="text-blue-600">buscando?</span>
          </h1>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* SELECTS CON KEYS CORREGIDAS */}
            <select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setCity("");
              }}
              className="p-3 bg-slate-50 rounded-2xl text-xs font-bold outline-none"
            >
              <option value="">Provincia</option>
              <option value="rio-negro">Río Negro</option>
              <option value="neuquen">Neuquén</option>
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!province}
              className="p-3 bg-slate-50 rounded-2xl text-xs font-bold outline-none disabled:opacity-50"
            >
              <option value="">Localidad</option>
              {province === "rio-negro" && (
                <>
                  <option value="general-roca">General Roca</option>
                  <option value="cipolletti">Cipolletti</option>
                </>
              )}
            </select>

            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="p-3 bg-slate-50 rounded-2xl text-xs font-bold outline-none"
            >
              <option value="">Operación</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-3 bg-slate-50 rounded-2xl text-xs font-bold outline-none"
            >
              <option value="">Propiedad</option>
              {propertyTypes.map((t) => (
                <option key={`type-opt-${t.slug}`} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              onFocus={() => setIsFocused(true)}
              className="w-full pl-14 pr-14 py-5 bg-slate-50 rounded-2xl text-lg font-semibold outline-none focus:ring-2 focus:ring-blue-600/20"
              placeholder="Calle o zona..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* DROPDOWN DE RESULTADOS */}
            {showDropdown && (
              <div className="absolute top-[110%] left-0 w-full bg-white border border-slate-100 rounded-3xl shadow-2xl z-40 max-h-96 overflow-y-auto divide-y divide-slate-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Resultados encontrados ({filtered.length})
                </div>

                {filtered.length > 0 ? (
                  filtered.map((p) => (
                    <Link
                      key={`prop-card-${p.id}`}
                      href={`/property/${p.slug}`}
                      className="flex items-center gap-4 p-4 hover:bg-blue-50/50 group transition-all"
                    >
                      {/* Miniatura */}
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
                        <Image
                          src={p.images[0] || "/placeholder.jpg"}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized={p.images[0]?.startsWith("data:")}
                        />
                      </div>

                      {/* Información Central */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate text-sm capitalize">
                          {p.title}
                        </h4>

                        {/* 📍 DIRECCIÓN Y LOCALIDAD */}
                        <div className="flex flex-col gap-0.5 mt-1">
                          <p className="text-slate-600 text-xs font-medium flex items-center gap-1">
                            <MapPin size={10} className="text-blue-500" />
                            {p.street} {p.number}
                          </p>
                          <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-tight pl-3.5">
                            {p.cityName}, {p.provinceName}
                          </p>
                        </div>
                      </div>

                      {/* Precio y Acción */}
                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-slate-900">
                          <span className="text-[10px] text-blue-600 mr-0.5">
                            {p.currency}
                          </span>
                          {p.amount.toLocaleString("es-AR")}
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[9px] font-black uppercase text-blue-500/60 tracking-tighter">
                            Ver detalle
                          </span>
                          <ChevronRight
                            size={12}
                            className="text-slate-300 group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                      No encontramos propiedades con esos filtros.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
