/* eslint-disable @next/next/no-img-element */
"use client";

import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import { PropertyGallery } from "@/components/shared/PropertyGalllery/PropertyGallery";
import { PropertyResponseDTO } from "@/dtos/property/property-response.dto";
import { formatPrice } from "@/utils/formatPrice";

export function PropertyDetailClient({
  property,
}: {
  property: PropertyResponseDTO;
}) {
  console.log('property0', property)
  // Sincronizado con tu Mapper
  const p = mapPropertyToUI(property);
  console.log('p de puto', p)

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 text-white">
      {/* 1. CABECERA PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-black uppercase tracking-wider">
              {p.operationType}
            </span>
            {/* Usando p.opportunity según tu Mapper */}
            {p.opportunity && (
              <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-black uppercase tracking-wider">
                Oportunidad
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-black">
            {p.title}
          </h1>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-black/70 font-bold text-lg">
            <span className="text-blue-500">📍</span>
            <span>{p.street} {p.number}</span>
            {/* Usando zoneName que combina Ciudad y Provincia */}
            <span className="text-gray-400 font-medium italic">
               | {p.zoneName}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:items-end">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">
            Valor de la propiedad
          </span>
          <div className="text-4xl md:text-5xl font-black text-blue-600 flex items-baseline gap-2">
            <span className="text-xl md:text-2xl">{p.currency}</span>
            <span>{formatPrice(p.amount)}</span>
          </div>
        </div>
      </div>

      {/* 2. GALERÍA */}
      <div className="mb-12">
        <PropertyGallery images={p.images} />
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-10">
        <div className="md:col-span-2 space-y-12">
          
          {/* Descripción */}
          {p.description && (
            <div className="space-y-4">
              <h3 className="text-2xl font-black uppercase italic border-l-4 border-blue-600 pl-4 tracking-tight text-black">
                Descripción General
              </h3>
              <p className="whitespace-pre-line leading-relaxed text-lg text-neutral-800">
                {p.description}
              </p>
            </div>
          )}

          {/* Ficha Técnica Rápida - Usando nombres exactos del Mapper */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 bg-neutral-100 p-8 rounded-3xl border border-black/5 shadow-sm">
            <Item label="Tipo" value={p.typeName} />
            <Item label="Ambientes" value={p.rooms} />
            <Item label="Dormitorios" value={p.bedrooms} />
            <Item label="Baños" value={p.bathrooms} />
            <Item label="Sup. Total" value={p.totalM2 ? `${p.totalM2} m²` : null} />
            <Item label="Cochera" value={p.garage ? "Si" : "No"} />
            {/* <Item label="Antigüedad" value={p.age > 0 ? `${p.age} años` : "A estrenar"} /> */}
          </div>
        </div>

        {/* Columna Lateral: UBICACIÓN */}
        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-3xl border border-white/10 shadow-2xl sticky top-24 text-white">
            <h3 className="text-xl font-black mb-6 uppercase italic border-l-4 border-white pl-3">
              Ubicación y Entorno
            </h3>

            <div className="space-y-5">
              <Item label="Dirección" value={`${p.street} ${p.number}`} light />
              {/* Usando provinceName y cityName del Mapper */}
              <Item label="Provincia" value={p.provinceName} light />
              <Item label="Localidad" value={p.cityName} light />
              <Item label="Código Postal" value={p.zipCode} light />

              {/* Mapa de Google con mapsUrl y externalMapsUrl */}
              {p.mapsUrl && (
                <div className="mt-6 border-t border-white/20 pt-6">
                  <div className="w-full h-56 rounded-2xl overflow-hidden border border-white/10 mb-4 bg-blue-700 shadow-inner">
                    <iframe
                      src={p.mapsUrl}
                      className="w-full h-full"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <a
                    href={p.externalMapsUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold uppercase tracking-widest text-blue-100 hover:text-white transition-colors flex items-center justify-center gap-2 bg-white/10 py-2 rounded-lg border border-white/5"
                  >
                    Abrir en Google Maps ↗
                  </a>
                </div>
              )}
            </div>

            <button className="w-full mt-8 bg-white text-blue-600 py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 shadow-xl hover:bg-blue-50 active:scale-95">
              Contactar Agente
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  function Item({ 
    label, 
    value, 
    light = false 
  }: { 
    label: string; 
    value: React.ReactNode; 
    light?: boolean 
  }) {
    if (value === null || value === undefined || value === "" || value === 0) return null;

    return (
      <div className="flex flex-col gap-0.5">
        <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${light ? 'text-blue-200' : 'text-gray-500'}`}>
          {label}
        </span>
        <span className={`text-lg font-bold leading-tight ${light ? 'text-white' : 'text-black'}`}>
          {value}
        </span>
      </div>
    );
  }
}