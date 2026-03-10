/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo, useState } from "react";
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import PropertyCardGrid from "@/components/shared/PropertyCardGridSearch/PropertyCardGridSearch";

interface Props {
  properties: PropertyUI[];
  filterParam: string;
  fixedCity?: string;
  fixedPropertyType?: string;
  fixedOperation?: "venta" | "alquiler";
  seoTitle?: string;
  seoDescription?: string;
}

export default function SearchTypePage({
  properties,
  filterParam,
  fixedCity,
  fixedPropertyType,
  fixedOperation,
  seoTitle,
  seoDescription,
}: Props) {

  const isCityLocked = !!fixedCity;
  const isTypeLocked = !!fixedPropertyType;

  const initialProvince =
    fixedCity && properties.length > 0
      ? (
          properties.find((p) => p.citySlug === fixedCity) ?? properties[0]
        )?.provinceSlug ?? ""
      : "";

  const [showFilters, setShowFilters] = useState(false);

  const [typesSelected, setTypesSelected] = useState<string[]>(
    fixedPropertyType ? [fixedPropertyType] : []
  );

  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [currency, setCurrency] = useState("");

  const [minM2, setMinM2] = useState<number | "">("");
  const [maxM2, setMaxM2] = useState<number | "">("");

  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [garage, setGarage] = useState(false);

  const [provinceSelected, setProvinceSelected] = useState(initialProvince);
  const [citySelected, setCitySelected] = useState(fixedCity ?? "");

  // Provincias disponibles
  const provinceOptions = useMemo(() => {
    const map = new Map<string, string>();

    properties.forEach((p) => {
      if (p.provinceSlug && p.provinceName) {
        map.set(p.provinceSlug, p.provinceName);
      }
    });

    return Array.from(map.entries()).sort((a, b) =>
      a[1].localeCompare(b[1])
    );
  }, [properties]);

  // Ciudades disponibles
  const cityOptions = useMemo(() => {
    const map = new Map<string, string>();

    const filteredByProv = provinceSelected
      ? properties.filter((p) => p.provinceSlug === provinceSelected)
      : properties;

    filteredByProv.forEach((p) => {
      if (p.citySlug && p.cityName) {
        map.set(p.citySlug, p.cityName);
      }
    });

    return Array.from(map.entries()).sort((a, b) =>
      a[1].localeCompare(b[1])
    );
  }, [properties, provinceSelected]);

  // Tipos de propiedad
  const propertyTypes = useMemo(() => {
    const map = new Map<string, string>();

    properties.forEach((p) => {
      if (p.typeSlug && p.typeName) {
        map.set(p.typeSlug, p.typeName);
      }
    });

    return Array.from(map.entries());
  }, [properties]);

  // FILTRADO
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
  }, [
    properties,
    typesSelected,
    minPrice,
    maxPrice,
    currency,
    minM2,
    maxM2,
    bedrooms,
    garage,
    provinceSelected,
    citySelected,
  ]);

  // Título fallback
  const getTitle = () => {
    const titles: Record<string, string> = {
      venta: "Propiedades en Venta",
      alquiler: "Propiedades en Alquiler",
      oportunidad: "Oportunidades Únicas",
    };

    return titles[filterParam] || "Nuestras Propiedades";
  };

  // Reset respetando filtros SEO
  const resetFilters = () => {
    setTypesSelected(fixedPropertyType ? [fixedPropertyType] : []);
    setMinPrice("");
    setMaxPrice("");
    setCurrency("");
    setMinM2("");
    setMaxM2("");
    setBedrooms("");
    setGarage(false);

    setProvinceSelected(initialProvince);
    setCitySelected(fixedCity ?? "");
  };

  const toggleType = (slug: string) => {
    if (isTypeLocked) return;

    setTypesSelected((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    );
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20 pt-24 lg:pt-48">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="font-montserrat text-4xl md:text-6xl font-black uppercase tracking-tighter text-oxford italic leading-none">
            {seoTitle ?? getTitle()}
          </h1>

          {seoDescription && (
            <p className="font-lora text-blue-gray text-sm md:text-base mt-3 max-w-2xl italic">
              {seoDescription}
            </p>
          )}

          <div className="flex items-center gap-4 mt-6">
            <div className="bg-gold-sand text-black px-4 py-1 rounded text-xs font-black uppercase italic shadow-sm">
              {filtered.length} Resultados
            </div>

            <div className="h-px bg-black/10 flex-1" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* BOTÓN MOBILE */}
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden w-full bg-oxford text-white py-4 rounded-xl font-montserrat font-black uppercase tracking-widest text-sm shadow-xl border-b-4 border-gold-sand"
          >
            Mostrar Filtros
          </button>

          {/* SIDEBAR */}
          <aside
            className={`
            ${
              showFilters
                ? "fixed inset-0 z-50 bg-oxford p-6 overflow-y-auto"
                : "hidden"
            }
            lg:relative lg:block lg:inset-auto lg:z-0 lg:bg-transparent lg:p-0 lg:w-80 shrink-0
          `}
          >
            <div className="bg-oxford p-8 rounded-[2rem] shadow-2xl border border-white/5 text-white">

              <div className="flex justify-between items-center mb-8 lg:mb-10">
                <h2 className="font-montserrat text-xl font-black uppercase tracking-tight border-l-4 border-gold-sand pl-4 italic">
                  Busqueda Fina
                </h2>

                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gold-sand font-bold text-xs uppercase"
                >
                  Cerrar ✕
                </button>
              </div>

              <div className="space-y-7">

                {/* TIPO */}
                <div className="space-y-3">
                  <label className="text-gold-secondary block uppercase text-[10px] tracking-[0.2em] font-black">
                    Categoría
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {propertyTypes.map(([slug, name]) => (
                      <button
                        key={slug}
                        disabled={isTypeLocked}
                        onClick={() => toggleType(slug)}
                        className={`px-3 py-2 rounded-md font-bold text-[10px] uppercase transition-all border ${
                          typesSelected.includes(slug)
                            ? "bg-gold-sand text-black border-gold-sand shadow-lg"
                            : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                        } ${
                          isTypeLocked
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* UBICACIÓN */}
                <div className="space-y-3">

                  <label className="text-gold-secondary block uppercase text-[10px] tracking-[0.2em] font-black">
                    Ubicación
                  </label>

                  <select
                    value={provinceSelected}
                    disabled={isCityLocked}
                    onChange={(e) => {
                      setProvinceSelected(e.target.value);
                      setCitySelected("");
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-gold-sand outline-none text-white disabled:opacity-40"
                  >
                    <option className="text-black" value="">Todas las Provincias</option>

                    {provinceOptions.map(([slug, name]) => (
                      <option key={slug} className="text-black" value={slug}>
                        {name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={citySelected}
                    disabled={isCityLocked}
                    onChange={(e) => setCitySelected(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-gold-sand outline-none text-white disabled:opacity-40"
                  >
                    <option className="text-black" value="">Todas las Localidades</option>

                    {cityOptions.map(([slug, name]) => (
                      <option key={slug} className="text-black" value={slug}>
                        {name}
                      </option>
                    ))}
                  </select>

                </div>

                {/* SUPERFICIE */}
                <div className="space-y-3">
                  <label className="text-gold-secondary block uppercase text-[10px] tracking-[0.2em] font-black">
                    Superficie Total (m²)
                  </label>

                  <div className="grid grid-cols-2 gap-3">

                    <input
                      type="number"
                      placeholder="Min"
                      value={minM2}
                      onChange={(e) =>
                        setMinM2(e.target.value ? Number(e.target.value) : "")
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white"
                    />

                    <input
                      type="number"
                      placeholder="Max"
                      value={maxM2}
                      onChange={(e) =>
                        setMaxM2(e.target.value ? Number(e.target.value) : "")
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white"
                    />

                  </div>
                </div>

                {/* PRECIO */}
                <div className="space-y-3">

                  <label className="text-gold-secondary block uppercase text-[10px] tracking-[0.2em] font-black">
                    Presupuesto
                  </label>

                  <div className="flex gap-2 mb-3">

                    {["USD", "ARS"].map((c) => (
                      <button
                        key={c}
                        onClick={() =>
                          setCurrency(currency === c ? "" : c)
                        }
                        className={`flex-1 py-2 rounded-md font-bold text-[10px] border ${
                          currency === c
                            ? "bg-gold-sand text-black border-gold-sand"
                            : "bg-white/5 text-white border-white/10"
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
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(e.target.value ? Number(e.target.value) : "")
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white"
                    />

                    <input
                      type="number"
                      placeholder="Máx"
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(e.target.value ? Number(e.target.value) : "")
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white"
                    />

                  </div>

                </div>

                {/* COCHERA */}
                <div className="pt-4">

                  <button
                    onClick={() => setGarage(!garage)}
                    className={`w-full flex justify-between items-center p-4 rounded-xl border ${
                      garage
                        ? "bg-gold-sand/20 border-gold-sand text-gold-sand"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Cochera
                    </span>

                    <span className="text-xs font-bold">
                      {garage ? "SÍ" : "NO"}
                    </span>

                  </button>

                </div>

                {/* ACCIONES */}
                <div className="pt-8 space-y-4 border-t border-white/10">

                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden w-full bg-gold-sand text-black py-4 rounded-xl font-black uppercase text-xs"
                  >
                    Aplicar Filtros
                  </button>

                  <button
                    onClick={resetFilters}
                    className="w-full text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-gold-sand"
                  >
                    ✕ Limpiar Búsqueda
                  </button>

                </div>

              </div>

            </div>
          </aside>

          {/* RESULTADOS */}
          <div className="flex-1">

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <PropertyCardGrid properties={filtered} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-black/5 shadow-inner">

                <div className="text-6xl mb-4">🏠</div>

                <h3 className="font-montserrat text-xl font-black uppercase text-oxford/20 italic">
                  No hay coincidencias
                </h3>

                <button
                  onClick={resetFilters}
                  className="mt-4 text-gold-sand font-bold uppercase text-xs tracking-widest border-b border-gold-sand pb-1"
                >
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