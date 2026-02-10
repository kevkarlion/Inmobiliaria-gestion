import SearchBar from "@/components/shared/SearchBar/SearchBar";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";
import Image from "next/image";

export default async function Hero() {
  const allProperties = await getUiProperties({ limit: 20 });

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* --- IMAGEN DE FONDO CON OVERLAY EXTENDIDO --- */}
      {/* Usamos z-0 para que esté sobre el fondo del body pero bajo el texto */}
      <div className="absolute inset-0 z-0">
        
        {/* Contenedor de imagen más alto que la sección para cubrir el overscroll */}
        <div className="relative w-full h-[115%] -top-[10%] lg:h-full lg:top-0">
          
          {/* Mobile */}
          <div className="relative w-full h-full block lg:hidden">
            <Image
              src="/hero-mobile.webp"
              alt="Hero Mobile"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Desktop */}
          <div className="relative w-full h-full hidden lg:block">
            <Image
              src="/bg-hero.webp"
              alt="Hero Desktop"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

        </div>
      </div>

      {/* --- CONTENIDO DEL HERO --- */}
      {/* Subimos el z-index para que el SearchBar sea clickable sobre la imagen */}
      <div className="relative lg:mt-24 z-20 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col items-center text-center">
        <h1 className="text-white text-4xl xl:text-5xl font-montserrat uppercase font-black italic drop-shadow-md mb-8">
          Estrategia para vender, <br />
          <span className="text-gold-sand">visión para comprar.</span>
        </h1>

        <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl">
          <SearchBar initialProperties={allProperties} />
        </div>
      </div>
    </section>
  );
}