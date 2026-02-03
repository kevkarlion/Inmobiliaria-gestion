"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Square, ChevronRight, Sparkles } from "lucide-react";
import { PropertyUI } from "@/domain/types/PropertyUI.types";

interface Props {
  property: PropertyUI;
}

export default function PropertyCardHome({ property }: Props) {
  return (
    <Link 
      href={`/property/${property.slug}`}
      className="group relative shrink-0 w-75 md:w-105 h-60 bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-white/10 block"
    >
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src={property.images[0] || "/placeholder.jpg"}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-70 group-hover:opacity-50"
        />
      </div>

      {/* Gradiente Negro */}
      <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent z-10" />

      {/* Contenido Superpuesto */}
      <div className="relative z-20 h-full p-6 flex flex-col justify-between font-montserrat">
        
        {/* Superior: Tags y Características */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <span className="bg-gold-sand text-slate-900 text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-widest w-fit">
              {property.operationType}
            </span>
            {/* Etiqueta de Oportunidad Condicional */}
            {property.opportunity && (
              <span className="bg-white/10 backdrop-blur-md text-gold-sand text-[8px] font-black uppercase px-2.5 py-1 rounded-full tracking-[0.2em] border border-gold-sand/30 flex items-center gap-1 w-fit">
                <Sparkles size={10} /> Oportunidad
              </span>
            )}
          </div>
          
          <div className="flex gap-1.5">
            <div className="flex items-center gap-1 backdrop-blur-md bg-white/5 px-2.5 py-1 rounded-full border border-white/10 text-white">
              <BedDouble size={12} className="text-gold-sand" />
              <span className="text-[10px] font-bold">{property.rooms || 0}</span>
            </div>
            <div className="flex items-center gap-1 backdrop-blur-md bg-white/5 px-2.5 py-1 rounded-full border border-white/10 text-white">
              <Square size={10} className="text-gold-sand" />
              <span className="text-[10px] font-bold">{property.coveredM2 || 0}m²</span>
            </div>
          </div>
        </div>

        {/* Inferior: Información Principal */}
        <div className="space-y-2">
          <div>
            <p className="text-gold-sand text-[8px] font-black uppercase tracking-[0.3em] mb-0.5">
              {property.typeName}
            </p>
            <h3 className="text-white text-lg md:text-xl font-black leading-tight uppercase italic tracking-tighter line-clamp-1">
              {property.title}
            </h3>
          </div>

          <div className="flex items-end justify-between">
            <div className="space-y-0.5">
              <div className="text-white text-2xl font-black tracking-tighter leading-none">
                <span className="text-gold-sand text-xs font-bold mr-0.5">{property.currency}</span>
                {property.amount.toLocaleString("es-AR")}
              </div>
              <div className="flex items-center gap-1 text-white/60">
                <MapPin size={12} className="text-gold-sand" />
                <p className="font-lora text-[11px] italic truncate w-36 md:w-48">
                  {property.cityName || "Patagonia"}
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-2.5 rounded-full group-hover:bg-gold-sand group-hover:text-slate-900 transition-all duration-500 text-white border border-white/10">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}