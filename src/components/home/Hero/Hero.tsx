import Image from "next/image";
import SearchBar from "@/components/shared/SearchBar/SearchBar";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background & Overlay */}
      <div className="absolute inset-0 z-0">
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
      {/* Ajustado el bottom y el padding para mejor armonía en laptops */}
      <div className="relative md:bottom-10 lg:bottom-20 z-10 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col items-center">
        <div className="text-center mb-8 lg:mb-12 space-y-4">
          <h1 className="text-white text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-montserrat tracking-tight leading-tight">
            Estrategia para vender, <br />
            <span className="text-gold-sand">visión para comprar.</span>
          </h1>
        </div>

        {/* Buscador: Reducido el max-width en laptops para que no sea tan ancho */}
        <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}