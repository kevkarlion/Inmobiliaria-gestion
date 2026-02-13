export const dynamic = "force-dynamic";
import SearchBar from "@/components/shared/SearchBar/SearchBar";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";
import Image from "next/image";

export default async function Hero() {
  const allProperties = await getUiProperties({ limit: 20 });

  return (
    <section className="w-full bg-oxford">

      {/* BLOQUE HERO */}
      <div className="relative w-full">

        {/* IMAGEN MOBILE */}
        <div className="block lg:hidden">
          <Image
            src="/hero-mobile.webp"
            alt="Hero Mobile"
            width={1600}
            height={1000}
            priority
            className="w-full h-[92vh] object-cover"
          />
        </div>

        {/* IMAGEN DESKTOP */}
        <div className="hidden lg:block">
          <Image
            src="/bg-hero.webp"
            alt="Hero Desktop"
            width={2400}
            height={1400}
            priority
            className="w-full h-[96vh] object-cover"
          />
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/40" />

        {/* CONTENIDO */}
        <div className="absolute inset-0 z-20 flex items-center justify-center mt-32">
          <div className="w-full max-w-7xl mx-auto px-6 text-center">
            
            <h1 className="text-white text-4xl xl:text-5xl font-montserrat uppercase font-black italic mb-8 drop-shadow-2xl">
              Estrategia para vender, <br />
              <span className="text-gold-sand">visión para comprar.</span>
            </h1>

            <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl mx-auto">
              <SearchBar initialProperties={allProperties} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

