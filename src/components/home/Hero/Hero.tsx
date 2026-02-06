// @/components/home/Hero/Hero.tsx
import Image from "next/image";
import SearchBar from "@/components/shared/SearchBar/SearchBar";
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";

export default async function Hero() {
  // 1. Llamada a la API (Capa HTTP)
  // Usamos la URL absoluta (necesaria en el servidor)
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  // Pasamos el límite por query param para que el DTO lo capture
  const res = await fetch(`${baseUrl}/api/properties?limit=500`, {
    next: { revalidate: 60 } // Cacheamos la respuesta de la API por 1 minuto
  });

  if (!res.ok) {
    console.error("Fallo al nutrir el buscador");
  }

  const data = await res.json();
  
  // 2. Mapeamos los items que vienen del PropertyResponseDTO al formato de la UI
  const allProperties = data.items ? data.items.map(mapPropertyToUI) : [];

  return (
    <section className="relative w-full min-h-[85vh] bg-slate-100 flex items-center justify-center overflow-visible z-30">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/bg-hero.png"
          alt="Inmobiliaria Riquelme"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col items-center">
        <div className="text-center mb-8 lg:mb-12 space-y-4">
          <h1 className="text-white text-4xl lg:text-4xl xl:text-5xl font-montserrat tracking-tight uppercase font-black italic">
            Estrategia para vender, <br />
            <span className="text-gold-sand">visión para comprar.</span>
          </h1>
        </div>

        <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl">
          <SearchBar initialProperties={allProperties} />
        </div>
      </div>
    </section>
  );
}