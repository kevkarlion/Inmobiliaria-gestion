/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo, useState, useCallback } from "react";
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import PropertyCardGrid from "@/components/shared/PropertyCardGridSearch/PropertyCardGridSearch";

interface Props {
  properties: PropertyUI[];
  filterParam: string;
}

export default function SearchTypePage({ properties, filterParam }: Props) {
  // Estados de visibilidad
  const [showFilters, setShowFilters] = useState(false);

  // Estados de filtros
  const [typesSelected, setTypesSelected] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [currency, setCurrency] = useState("");
  const [minM2, setMinM2] = useState<number | "">("");
  const [maxM2, setMaxM2] = useState<number | "">("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [garage, setGarage] = useState(false);
  const [provinceSelected, setProvinceSelected] = useState("");
  const [citySelected, setCitySelected] = useState("");

  // 1. Opciones de filtros
  const provinceOptions = useMemo(() => {
    const map = new Map();
    properties.forEach(p => {
      if (p.provinceSlug && p.provinceName) map.set(p.provinceSlug, p.provinceName);
    });
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [properties]);

  const cityOptions = useMemo(() => {
    const map = new Map();
    const filteredByProv = provinceSelected 
      ? properties.filter(p => p.provinceSlug === provinceSelected)
      : properties;
    
    filteredByProv.forEach(p => {
      if (p.citySlug && p.cityName) map.set(p.citySlug, p.cityName);
    });
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [properties, provinceSelected]);

  const propertyTypes = useMemo(() => {
    const map = new Map();
    properties.forEach(p => {
        if(p.typeSlug && p.typeName) map.set(p.typeSlug, p.typeName);
    });
    return Array.from(map.entries());
  }, [properties]);

  // 2. Lógica de Filtrado
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (typesSelected.length && !typesSelected.includes(p.typeSlug)) return false;
      if (minPrice !== "" && p.amount < minPrice) return false;
      if (maxPrice !== "" && p.amount > maxPrice) return false;
      if (currency && p.currency !== currency) return false;
      if (minM2 !== "" && p.totalM2 < minM2) return false;
      if (maxM2 !== "" && p.totalM2 > maxM2) return false;
      if (bedrooms !== "" && p.bedrooms < (bedrooms as number)) return false;
      if (garage && !p.garage) return false;
      if (provinceSelected && p.provinceSlug !== provinceSelected) return false;
      if (citySelected && p.citySlug !== citySelected) return false;
      return true;
    });
  }, [properties, typesSelected, minPrice, maxPrice, currency, minM2, maxM2, bedrooms, garage, provinceSelected, citySelected]);

  // 3. Título dinámico
  const getTitle = () => {
    const titles: Record<string, string> = {
      venta: "Propiedades en Venta",
      alquiler: "Propiedades en Alquiler",
      oportunidad: "Oportunidades Únicas",
    };
    return titles[filterParam] || "Nuestras Propiedades";
  };

  const resetFilters = () => {
    setTypesSelected([]); setMinPrice(""); setMaxPrice(""); setCurrency("");
    setMinM2(""); setMaxM2(""); setBedrooms(""); setGarage(false);
    setProvinceSelected(""); setCitySelected("");
  };

  const toggleType = (slug: string) => {
    setTypesSelected(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20 pt-24 lg:pt-48">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HEADER SECCIÓN */}
        <div className="mb-12">
          <h1 className="font-montserrat text-4xl md:text-6xl font-black uppercase tracking-tighter text-oxford italic leading-none">
            {getTitle()}
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <div className="bg-gold-sand text-black px-4 py-1 rounded text-xs font-black uppercase italic shadow-sm">
              {filtered.length} Resultados
            </div>
            <div className="h-px bg-black/10 flex-1" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* BOTÓN FILTRAR (SOLO MOBILE) */}
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden w-full bg-oxford text-white py-4 rounded-xl font-montserrat font-black uppercase tracking-widest text-sm shadow-xl border-b-4 border-gold-sand"
          >
            Mostrar Filtros
          </button>

          {/* SIDEBAR DE FILTROS */}
          <aside className={`
            ${showFilters ? "fixed inset-0 z-50 bg-oxford p-6 overflow-y-auto" : "hidden"} 
            lg:relative lg:block lg:inset-auto lg:z-0 lg:bg-transparent lg:p-0 lg:w-80 shrink-0
          `}>
            <div className="bg-oxford p-8 rounded-[2rem] shadow-2xl border border-white/5 text-white">
              
              <div className="flex justify-between items-center mb-8 lg:mb-10">
                <h2 className="font-montserrat text-xl font-black uppercase tracking-tight border-l-4 border-gold-sand pl-4 italic">
                  Busqueda Fina
                </h2>
                <button onClick={() => setShowFilters(false)} className="lg:hidden text-gold-sand font-bold text-xs uppercase">
                  Cerrar ✕
                </button>
              </div>

              <div className="space-y-7">

                {/* CATEGORÍA (Tipo de Propiedad) */}
                <div className="space-y-3">
                  <label className="text-gold-secondary block uppercase text-[10px] tracking-[0.2em] font-black">Categoría</label>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypes.map(([slug, name]) => (
                      <button
                        key={slug}
                        onClick={() => toggleType(slug)}
                        className={`px-3 py-2 rounded-md font-bold text-[10px] uppercase transition-all border ${
                          typesSelected.includes(slug) 
                            ? "bg-gold-sand text-black border-gold-sand shadow-lg" 
                            : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* UBICACIÓN */}
                <div className="space-y-3">
                  <label className="text-gold-secondary block uppercase text-[10px] tracking-[0.2em] font-black">Ubicación</label>
                  <select 
                    value={provinceSelected}
                    onChange={(e) => { setProvinceSelected(e.target.value); setCitySelected(""); }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-gold-sand outline-none text-white cursor-pointer"
                  >
                    <option value="" className="bg-oxford">Todas las Provincias</option>
                    {provinceOptions.map(([slug, name]) => (
                      <option key={slug} value={slug} className="bg-oxford">{name}</option>
                    ))}
                  </select>

                  <select 
                    value={citySelected}
                    onChange={(e) => setCitySelected(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-gold-sand outline-none text-white cursor-pointer disabled:opacity-30"
                    disabled={!provinceSelected}
                  >
                    <option value="" className="bg-oxford">Todas las Localidades</option>
                    {cityOptions.map(([slug, name]) => (
                      <option key={slug} value={slug} className="bg-oxford">{name}</option>
                    ))}
                  </select>
                </div>

                {/* SUPERFICIE */}
                <div className="space-y-3">
                  <label className="text-gold-secondary block uppercase text-[10px] tracking-[0.2em] font-black">Superficie Total (m²)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-gold-sand outline-none text-white placeholder:text-white/20"
                      value={minM2}
                      onChange={(e) => setMinM2(e.target.value ? Number(e.target.value) : "")}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-gold-sand outline-none text-white placeholder:text-white/20"
                      value={maxM2}
                      onChange={(e) => setMaxM2(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>
                </div>

                {/* PRECIO Y MONEDA */}
                <div className="space-y-3">
                  <label className="text-gold-secondary block uppercase text-[10px] tracking-[0.2em] font-black">Presupuesto</label>
                  <div className="flex gap-2 mb-3">
                    {["USD", "ARS"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCurrency(currency === c ? "" : c)}
                        className={`flex-1 py-2 rounded-md font-bold text-[10px] transition-all border ${
                          currency === c ? "bg-gold-sand text-black border-gold-sand" : "bg-white/5 text-white border-white/10"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Mín"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-gold-sand outline-none text-white placeholder:text-white/20"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-gold-sand outline-none text-white placeholder:text-white/20"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>
                </div>

                {/* AMENITIES */}
                <div className="pt-4 space-y-4">
                  <button
                    onClick={() => setGarage(!garage)}
                    className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all ${
                      garage ? "bg-gold-sand/20 border-gold-sand text-gold-sand shadow-[0_0_15px_rgba(212,175,55,0.1)]" : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">Cochera</span>
                    <span className="text-xs font-bold">{garage ? "SÍ" : "NO"}</span>
                  </button>
                </div>

                {/* ACCIONES FINALES */}
                <div className="pt-8 space-y-4 border-t border-white/10">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden w-full bg-gold-sand text-black py-4 rounded-xl font-montserrat font-black uppercase text-xs shadow-2xl transition-transform active:scale-95"
                  >
                    Aplicar Filtros
                  </button>
                  <button
                    onClick={resetFilters}
                    className="w-full text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-gold-sand transition-colors flex justify-center items-center gap-2 py-2"
                  >
                    ✕ Limpiar Búsqueda
                  </button>
                </div>

              </div>
            </div>
          </aside>

          {/* GRILLA DE RESULTADOS */}
          <div className="flex-1">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <PropertyCardGrid properties={filtered} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-black/5 shadow-inner">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="font-montserrat text-xl font-black uppercase text-oxford/20 italic">No hay coincidencias</h3>
                <button onClick={resetFilters} className="mt-4 text-gold-sand font-bold uppercase text-xs tracking-widest border-b border-gold-sand pb-1">
                  Reintentar
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}