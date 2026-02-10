import SearchBar from "@/components/shared/SearchBar/SearchBar";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";

export default async function Hero() {
  const allProperties = await getUiProperties({ limit: 20 });

  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-transparent">
      
      {/* Overlay: Esta capa oscurece la imagen del layout solo en esta sección */}
      <div className="absolute inset-0 bg-black/45 -z-10" />

      {/* Contenedor de contenido */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col items-center">
        
        {/* Título con sombra de texto sutil para mejorar legibilidad sobre fotos complejas */}
        <div className="text-center mb-8 lg:mb-12 space-y-4">
          <h1 className="text-white text-4xl xl:text-5xl font-montserrat uppercase font-black italic drop-shadow-lg">
            Estrategia para vender, <br />
            <span className="text-gold-sand">visión para comprar.</span>
          </h1>
        </div>

        {/* Buscador */}
        <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl">
          <SearchBar initialProperties={allProperties} />
        </div>
      </div>
    </section>
  );
}