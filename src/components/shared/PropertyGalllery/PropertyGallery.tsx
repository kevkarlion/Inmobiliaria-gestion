"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PropertyGallery({ images = [] }: { images?: string[] }) {
  const [index, setIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const validImages = images.filter(Boolean);

  // ⚡ Efecto para centrar la miniatura activa en el carrusel inferior
 useEffect(() => {
  const container = scrollContainerRef.current;
  if (container) {
    const activeThumbnail = container.children[index] as HTMLElement;
    
    if (activeThumbnail) {
      // 1. Calculamos la posición del elemento respecto al contenedor
      const elementOffset = activeThumbnail.offsetLeft;
      const elementWidth = activeThumbnail.offsetWidth;
      const containerWidth = container.offsetWidth;

      // 2. Calculamos el punto exacto para que quede centrado
      const scrollTarget = elementOffset - (containerWidth / 2) + (elementWidth / 2);

      // 3. Movemos SOLO el scroll interno del contenedor
      container.scrollTo({
        left: scrollTarget,
        behavior: "smooth",
      });
    }
  }
}, [index]); // Se ejecutará cada vez que cambies de imagen

  if (!validImages.length)
    return (
      <div className="w-full h-64 flex items-center justify-center bg-neutral-900 text-gray-500 rounded-2xl border border-white/10">
        Sin imágenes disponibles
      </div>
    );

  const prev = () => setIndex((i) => (i === 0 ? validImages.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === validImages.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-6">
      {/* Contenedor Principal */}
      <div className="relative w-full aspect-3/2 md:aspect-video max-h-125 rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black">
        <Image
          src={validImages[index]}
          alt={`Propiedad - Imagen ${index + 1}`}
          fill
          // Solo prioridad a la primera imagen para optimizar el LCP
          priority={index === 0}
          loading={index === 0 ? undefined : "lazy"}
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
        />
        
        {/* Controles */}
        <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
          <button 
            onClick={prev} 
            className="pointer-events-auto bg-black/40 hover:bg-white hover:text-black backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={next} 
            className="pointer-events-auto bg-black/40 hover:bg-white hover:text-black backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Contador */}
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest border border-white/10">
          {index + 1} / {validImages.length}
        </div>
      </div>

      {/* Carrusel de Miniaturas (Thumbnails) */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 mt-6 overflow-x-auto pb-4 no-scrollbar justify-start sm:justify-center scroll-smooth"
      >
        {validImages.map((img, i) => (
          <button 
            key={i}
            onClick={() => setIndex(i)} 
            className={`relative shrink-0 transition-all duration-300 rounded-lg overflow-hidden border-2 ${
              i === index 
                ? "border-white scale-105 shadow-lg shadow-white/10" 
                : "border-transparent opacity-40 hover:opacity-100"
            }`}
          >
            <div className="relative w-16 h-12 sm:w-24 sm:h-16">
              <Image 
                src={img} 
                alt={`Thumbnail ${i + 1}`} 
                fill 
                className="object-cover"
                // Optimizamos la carga de miniaturas pidiendo un tamaño pequeño
                sizes="100px" 
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}