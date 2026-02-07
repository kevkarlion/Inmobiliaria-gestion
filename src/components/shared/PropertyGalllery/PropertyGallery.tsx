"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PropertyGallery({ images = [] }: { images?: string[] }) {
  const [index, setIndex] = useState(0);

  // ⚡ Filtramos cualquier valor vacío o inválido
  const validImages = images.filter(Boolean);

  if (!validImages.length)
    return (
      <div className="w-full h-64 flex items-center justify-center bg-neutral-800 text-gray-500 rounded-xl border border-white/10">
        Sin imágenes disponibles
      </div>
    );

  const prev = () => setIndex((i) => (i === 0 ? validImages.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === validImages.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-6">
      <div className="relative w-full aspect-3/2 md:aspect-video max-h-125 rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black">
        <Image
          src={validImages[index]}
          alt={`Imagen ${index + 1}`}
          fill
          priority
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
        />
        <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
          <button 
            onClick={prev} 
            className="pointer-events-auto bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-3 rounded-full transition-all active:scale-90"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={next} 
            className="pointer-events-auto bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-3 rounded-full transition-all active:scale-90"
          >
            <ChevronRight size={28} />
          </button>
        </div>
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest border border-white/10">
          {index + 1} / {validImages.length}
        </div>
      </div>

      <div className="flex gap-3 mt-6 overflow-x-auto pb-4 no-scrollbar justify-center">
        {validImages.map((img, i) => (
          <button 
            key={i} // ⚡ Usamos índice en vez de `img` para evitar duplicados
            onClick={() => setIndex(i)} 
            className={`relative shrink-0 transition-all duration-300 rounded-xl overflow-hidden border-2 ${
              i === index ? "border-blue-600 scale-105 shadow-lg shadow-blue-500/20" : "border-transparent opacity-50 hover:opacity-100"
            }`}
          >
            <div className="relative w-20 h-14 sm:w-24 sm:h-16">
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" unoptimized />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
