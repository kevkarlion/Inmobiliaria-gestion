"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyUI } from "@/domain/types/PropertyUI.types";
import PropertyCardHome from "@/components/shared/PropertyCardHome/PropertyCardHome";
import PropertyCardSkeleton from "@/components/skeletons/PropertyCardSkeleton";

interface Props {
  title: string;
  subtitle: string;
  properties: PropertyUI[];
  isLoading?: boolean;
}

export default function PropertyGrid({ title, subtitle, properties, isLoading }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 444; 
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    /* CAMBIO CLAVE: 'bg-slate-50' es un gris muy suave que hace que las cards blancas 
       tomen protagonismo y se sientan "fuera" de la pantalla.
    */
    <section className="relative w-full py-24 bg-slate-100 overflow-hidden border-y border-slate-100">
      
      {/* Patrón decorativo: Ahora con opacidad 0.4 para que sea sutil pero perceptible */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e1' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
           }} 
      />

      <div className="max-w-350 mx-auto px-6 relative z-10">
        
        {/* Cabecera Centrada */}
        <div className="flex flex-col items-center text-center mb-16 space-y-5">
          <div className="max-w-4xl space-y-4">
            
            <div className="flex items-center justify-center gap-6">
              <div className="hidden md:flex items-center">
                <div className="w-12 lg:w-20 h-px bg-slate-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-gold-sand ml-2" />
              </div>

              <h2 className="font-montserrat text-3xl md:text-4xl 2xl:text-5xl font-black text-slate-900 uppercase tracking-tighter shrink-0">
                {title}
              </h2>

              <div className="hidden md:flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-sand mr-2" />
                <div className="w-12 lg:w-20 h-px bg-slate-200" />
              </div>
            </div>

            <p className="font-lora text-slate-600 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto italic">
              {subtitle}
            </p>
            
            {/* Divisor Dorado */}
            <div className="flex justify-center items-center gap-3">
              <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
              <div className="w-16 h-px bg-gold-sand/40" />
              <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
            </div>
          </div>
        </div>

        {/* CONTENEDOR DEL CARRUSEL */}
        <div className="relative group">
          {/* Navegación Desktop: Con sombras más profundas para contrastar con el fondo gris */}
          <div className="hidden md:block">
            <button 
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white shadow-2xl border border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white shadow-2xl border border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex flex-nowrap gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="snap-start shrink-0">
                  <PropertyCardSkeleton />
                </div>
              ))
            ) : (
              properties.map((item) => (
                <div key={item.id} className="snap-start shrink-0 transition-all duration-500 hover:-translate-y-3">
                  <PropertyCardHome property={item} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Navegación móvil */}
        <div className="flex md:hidden justify-center gap-6 mt-2">
          <button onClick={() => scroll("left")} className="p-4 rounded-full bg-white border border-slate-200 shadow-md active:scale-90 transition-all">
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
          <button onClick={() => scroll("right")} className="p-4 rounded-full bg-slate-900 text-white shadow-lg active:scale-90 transition-all">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}