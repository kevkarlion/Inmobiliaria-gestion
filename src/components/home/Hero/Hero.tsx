// @/components/home/Hero/Hero.tsx
import Image from "next/image";
import SearchBar from "@/components/shared/SearchBar/SearchBar";
import { PropertyService } from "@/server/services/property.service"; // Tu servicio con el método static
import { mapPropertyToUI } from "@/domain/mappers/mapPropertyToUI";

export default async function Hero() {
  // 1. Obtenemos las propiedades directamente desde el servidor
  // Traemos un límite alto (ej: 500) para que el buscador de cliente tenga qué filtrar
  const data = await PropertyService.findAll({
    filters: {}, // Sin filtros para el buscador global
    pagination: { page: 1, limit: 500, skip: 0 },
    sort: { sort: { createdAt: -1 } }
  });

  // 2. Mapeamos a la interfaz de la UI
  const allProperties = data.items.map(mapPropertyToUI);

  return (
    <section className="relative w-full min-h-[85vh] bg-slate-100 flex items-center justify-center overflow-visible z-30">
      {/* Background */}
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

      {/* Content */}
      <div className="relative bottom-15 md:bottom-10 lg:bottom-20 z-10 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col items-center">
        <div className="text-center mb-8 lg:mb-12 space-y-4">
          <h1 className="text-white text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-montserrat tracking-tight leading-tight uppercase font-black italic">
            Estrategia para vender, <br />
            <span className="text-gold-sand">visión para comprar.</span>
          </h1>
        </div>

        {/* Buscador: Ahora le pasamos las propiedades por props */}
        <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
          <SearchBar initialProperties={allProperties} />
        </div>
      </div>
    </section>
  );
}