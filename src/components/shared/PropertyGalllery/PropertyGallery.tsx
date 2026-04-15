"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDeviceResolution } from "@/lib/device-resolution";

interface PropertyGalleryProps {
  images?: string[];       // Fallback backward compatibility
  imagesDesktop?: string[];
  imagesMobile?: string[];
  reserved?: boolean;
  sold?: boolean;
}

export function PropertyGallery({ 
  images = [], 
  imagesDesktop = [], 
  imagesMobile = [],
  reserved,
  sold
}: PropertyGalleryProps) {
  const [index, setIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useDeviceResolution();

  // Seleccionar el array correcto según el dispositivo
  // Si el array específico está vacío, usar images como fallback
  const selectedImages = isMobile 
    ? (imagesMobile.length > 0 ? imagesMobile : images)
    : (imagesDesktop.length > 0 ? imagesDesktop : images);
  
  const validImages = selectedImages.filter(Boolean);

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
      <div className="relative w-full aspect-[3/4] md:aspect-[2/3] max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black">
        
        <Image
          src={validImages[index]}
          alt={`Propiedad - Imagen ${index + 1}`}
          fill
          priority={index === 0}
          loading={index === 0 ? undefined : "lazy"}
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
        />
        
        {/* Controles - dentro del contenedor */}
        <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none z-20">
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
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest border border-white/10 z-20">
          {index + 1} / {validImages.length}
        </div>

        {/* RIBBON: Reserved - mobile (hidden en laptop) */}
        {reserved && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 md:hidden">
            <div 
              className="absolute bg-amber-500 text-white font-black uppercase tracking-wider py-3 shadow-xl flex items-center justify-center text-xs"
              style={{
                left: '44%',
                top: '-7%',
                width: '79%',
                transformOrigin: '0% 0%',
                transform: 'rotate(29.74deg)',
              }}
            >
              <span className="whitespace-nowrap">⏱️ RESERVADA</span>
            </div>
          </div>
        )}
        
        {/* RIBBON: Sold - mobile (hidden en laptop) */}
        {sold && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 md:hidden">
            <div 
              className="absolute bg-red-600 text-white font-black uppercase tracking-wider py-3 shadow-xl flex items-center justify-center text-xs"
              style={{
                left: '44%',
                top: '-7%',
                width: '79%',
                transformOrigin: '0% 0%',
                transform: 'rotate(29.74deg)',
              }}
            >
              <span className="whitespace-nowrap">✅ VENDIDA</span>
            </div>
          </div>
        )}

        {/* RIBBON Reserved - laptop (solo visible en md+) */}
        {reserved && (
          <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden z-10">
            <div 
              className="absolute bg-amber-500 text-white font-black uppercase tracking-wider py-3 shadow-xl flex items-center justify-center md:text-sm"
              style={{
                left: '35%',
                top: '-28%',
                width: '95%',
                transformOrigin: '0% 0%',
                transform: 'rotate(29.74deg)',
              }}
            >
              <span className="whitespace-nowrap">⏱️ RESERVADA</span>
            </div>
          </div>
        )}
        
        {/* RIBBON Sold - laptop (solo visible en md+) */}
        {sold && (
          <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden z-10">
            <div 
              className="absolute bg-red-600 text-white font-black uppercase tracking-wider py-3 shadow-xl flex items-center justify-center md:text-sm"
              style={{
                left: '35%',
                top: '-28%',
                width: '95%',
                transformOrigin: '0% 0%',
                transform: 'rotate(29.74deg)',
              }}
            >
              <span className="whitespace-nowrap">✅ VENDIDA</span>
            </div>
          </div>
        )}
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
                sizes="100px"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}