"use client";

import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";
import { PropertyGallery } from "@/components/shared/PropertyGalllery/PropertyGallery";
import { PropertyResponseDTO } from "@/dtos/property/property-response.dto";
import { formatPrice } from '@/utils/formatPrice';

export function PropertyDetailClient({ property }: { property: PropertyResponseDTO }) {
  const p = mapPropertyToUI(property);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 text-white">
      
      {/* 1. CABECERA PRINCIPAL: Título y Precio */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-xl px-2 py-0.5 rounded font-black uppercase tracking-wider">
              {p.operationType}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-black">
            {p.title}
          </h1>
          <p className="text-black font-bold text-lg flex items-center gap-2">
            <span className="text-blue-500">📍</span> {p.street} {p.number}, {p.zoneName}
          </p>
        </div>

        <div className="flex flex-col md:items-end">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Valor</span>
          <div className="text-4xl md:text-5xl font-black text-blue-500 flex items-baseline gap-2">
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
          <div className="space-y-4">
            <h3 className="text-2xl font-black uppercase italic border-l-4 border-blue-600 pl-4 tracking-tight text-black">
              Descripción General
            </h3>
            <p className=" whitespace-pre-line leading-relaxed text-lg text-black">
              {p.description}
            </p>
          </div>

          {/* Ficha Técnica Rápida */}
          <div className="text-black grid grid-cols-2 sm:grid-cols-3 gap-8 bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl">
            <Item label="Tipo de Propiedad" value={p.typeName} />
            <Item label="Ambientes" value={p.rooms} />
            <Item label="Dormitorios" value={p.bedrooms} />
            <Item label="Baños" value={p.bathrooms} />
            <Item label="Superficie Total" value={`${p.totalM2} m²`} />
            <Item label="Cochera" value={p.garage ? "Si" : "No"} />
          </div>
        </div>

        {/* Columna Lateral: UBICACIÓN */}
        <div className="space-y-6">
          <div className="bg-blue-700 p-8 rounded-3xl border border-white/10 shadow-2xl sticky top-24">
            <h3 className="text-xl font-bold mb-6 uppercase italic border-l-4 border-blue-600 pl-3">Ubicación</h3>
            
            <div className="space-y-5">
              <Item label="Dirección" value={`${p.street} ${p.number}`} />
              <Item label="Zona" value={p.zoneName} />
              <Item label="Código Postal" value={p.zipCode} />
              
              {p.mapsUrl && (
                <div className="mt-6 border-t border-white/5 pt-6">
                  <div className="w-full h-56 rounded-2xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                    <iframe 
                      src={p.mapsUrl} 
                      className="w-full h-full" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                    />
                  </div>
                  <a 
                    href={p.mapsUrl}
                    target="_blank"
                    className="flex justify-center items-center mt-4 text-[10px] font-black text-blue-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
                  >
                    Abrir en Google Maps →
                  </a>
                </div>
              )}
            </div>

            <button className="w-full mt-8 bg-blue-600 hover:bg-white hover:text-black py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-blue-600/20 active:scale-95">
              Contactar Agente
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  function Item({ label, value }: { label: string; value: React.ReactNode }) {
    return (
      <div className="flex flex-col gap-1">
        {/* Label en negro como pediste */}
        <span className="text-[10px]  font-black uppercase tracking-widest text-black">{label}</span>
        <span className="text-xl font-bold text-black ">{value || "---"}</span>
      </div>
    );
  }
}