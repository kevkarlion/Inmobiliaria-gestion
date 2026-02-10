import SearchBar from "@/components/shared/SearchBar/SearchBar";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";

export default async function Hero() {
  const allProperties = await getUiProperties({ limit: 20 });

  return (
    <section
      className="relative w-full min-h-screen xl:min-h-[110vh] flex items-center justify-center overflow-hidden
                 bg-[url('/hero-mobile.webp')] lg:bg-[url('/bg-hero.webp')] bg-cover bg-center"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col items-center mt-16">
        <div className="text-center mb-8 lg:mb-12 space-y-4">
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
