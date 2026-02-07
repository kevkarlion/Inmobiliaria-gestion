// @/components/home/Hero/Hero.tsx
import Image from "next/image";
import SearchBar from "@/components/shared/SearchBar/SearchBar";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";

export default async function Hero() {
  /** * 1. Llamada a la función centralizada de servidor.
   * Traemos 20 propiedades de forma directa para alimentar el autocompletado del buscador.
   */
  const allProperties = await getUiProperties({ limit: 20 });

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