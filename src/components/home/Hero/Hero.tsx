import SearchBar from "@/components/shared/SearchBar/SearchBar";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";
import Image from "next/image";

export default async function Hero() {
  const allProperties = await getUiProperties({ limit: 20 });

  return (
   <section className="relative w-full min-h-screen xl:min-h-[110vh] flex flex-col">
  
  {/* --- IMAGEN DEL HERO: STICKY SOLO DENTRO DE LA SECCIÓN --- */}
  <div className="absolute top-25 inset-0 -z-10">
    {/* Mobile */}
    <div className="block lg:hidden w-full h-full relative ">
      <Image
        src="/hero-mobile.webp"
        alt="Hero Mobile"
        fill
        className="object-cover"
        priority
      />
    </div>
    {/* Desktop */}
    <div className="hidden lg:block w-full h-full relative">
      <Image
        src="/bg-hero.webp"
        alt="Hero Desktop"
        fill
        className="object-cover"
        priority
      />
    </div>

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/40" />
  </div>

  {/* --- CONTENIDO DEL HERO --- */}
  <div className="relative top-35 z-20 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col items-center">
    <div className="text-center lg:mt-12 lg:mb-12 space-y-4">
      <h1 className="text-white text-4xl xl:text-5xl font-montserrat uppercase font-black italic drop-shadow-md">
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
