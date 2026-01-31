"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PropertyGallery({ images = [] }: { images?: string[] }) {
  const [index, setIndex] = useState(0);

  if (!images.length)
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-500">
        Sin imágenes disponibles
      </div>
    );

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <Image
          src={images[index]}
          alt={`Imagen ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 900px"
        />
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button key={img} onClick={() => setIndex(i)} className={`shrink-0 border-2 rounded-lg overflow-hidden ${i === index ? "border-blue-600" : "border-transparent"}`}>
            <div className="relative w-24 h-16 sm:w-28 sm:h-20">
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
