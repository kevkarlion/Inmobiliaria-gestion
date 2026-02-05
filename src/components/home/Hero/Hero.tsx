import Image from "next/image";
import SearchBar from "@/components/shared/SearchBar/SearchBar";

// @/components/home/Hero/Hero.tsx
export default function Hero() {
  return (
    // CAMBIO: overflow-visible para que el dropdown pueda salir de la sección
    // Agregamos z-[30] para asegurar que gane a cualquier componente de abajo
    <section className="relative w-full min-h-[85vh] bg-slate-100 flex items-center justify-center overflow-visible z-30">
      {/* Background - Este SI debe estar recortado */}
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
      <div className="relative bottom-15
       md:bottom-10 lg:bottom-20 z-10 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col items-center">
        <div className="text-center mb-8 lg:mb-12 space-y-4">
          <h1 className="text-white text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-montserrat tracking-tight leading-tight uppercase font-black italic">
            Estrategia para vender, <br />
            <span className="text-gold-sand">visión para comprar.</span>
          </h1>
        </div>

        {/* Buscador */}
        <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}