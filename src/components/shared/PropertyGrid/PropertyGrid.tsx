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

export default function PropertyGrid({ title, properties, isLoading }: Props) {
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
    <section className="w-full py-20 bg-white overflow-hidden">
      {/* Contenedor principal con ancho máximo controlado para que no se "desparrame" */}
      <div className="max-w-325 mx-auto px-6 relative">
        
        {/* Cabecera Centrada - mb-10 en lugar de mb-16 para acercar las cards */}
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <div className="max-w-4xl space-y-4">
            
            {/* Título con diseño decorativo */}
            <div className="flex items-center justify-center gap-6">
              <div className="hidden md:flex items-center">
                <div className="w-8 lg:w-16 h-px bg-slate-200" />
                <div className="w-1 h-1 rounded-full bg-gold-sand ml-2" />
              </div>

              <h2 className="font-montserrat text-3xl md:text-4xl 2xl:text-5xl font-black text-slate-900 uppercase tracking-tighter shrink-0">
                {title}
              </h2>

              <div className="hidden md:flex items-center">
                <div className="w-1 h-1 rounded-full bg-gold-sand mr-2" />
                <div className="w-8 lg:w-16 h-px bg-slate-200" />
              </div>
            </div>

            <p className="font-lora text-slate-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto italic opacity-80">
              Propiedades con condiciones especiales, ideales para quienes buscan una decisión inteligente. 
              Inmuebles que destacan por su atractivo valor, disponibilidad inmediata o situaciones 
              particulares que representan una excelente ocasión dentro del mercado.
            </p>
            
            {/* Acento inferior más sutil */}
            <div className="flex justify-center items-center gap-1.5 opacity-40">
              <div className="w-1 h-1 rotate-45 border border-gold-sand" />
              <div className="w-8 h-px bg-gold-sand" />
              <div className="w-1 h-1 rotate-45 border border-gold-sand" />
            </div>
          </div>
        </div>

        {/* CONTENEDOR DEL CARRUSEL CON NAVEGACIÓN LATERAL */}
        <div className="relative group">
          {/* Botones Flotantes (Solo visibles en hover del carrusel en Desktop) */}
          <div className="hidden md:block">
            <button 
              onClick={() => scroll("left")}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white shadow-xl border border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-left-4"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white shadow-xl border border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-right-4"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex flex-nowrap gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
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
                <div key={item.id} className="snap-start shrink-0">
                  <PropertyCardHome property={item} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Navegación móvil (Visible solo en pantallas pequeñas) */}
        <div className="flex md:hidden justify-center gap-4 mt-4">
          <button onClick={() => scroll("left")} className="p-3 rounded-full border border-slate-200">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll("right")} className="p-3 rounded-full bg-slate-900 text-white">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}