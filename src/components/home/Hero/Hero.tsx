export const dynamic = "force-dynamic";
import SearchBar from "@/components/shared/SearchBar/SearchBar";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";
import Image from "next/image";

export default async function Hero() {
  const allProperties = await getUiProperties({ limit: 20 });

  return (
    <section className="w-full min-h-screen bg-oxford">
      {/* BLOQUE HERO */}
      <div className="relative w-full min-h-screen">
        {/* IMÁGENES */}
        <div className="block lg:hidden absolute inset-0 -top-16">
          <Image
            src="/hero-mobile.webp"
            alt="Venta de casas, departamentos y terrenos en General Roca"
            width={1600}
            height={1000}
            priority
            className="w-full h-[calc(100vh+64px)] object-cover"
          />
        </div>

        <div className="hidden lg:block absolute inset-0 -top-16 lg:top-0">
          <Image
            src="/bg-hero.webp"
            alt="Propiedades exclusivas en General Roca - Riquelme Propiedades"
            width={2400}
            height={1600}
            priority
            className="w-full h-[calc(100vh+64px)] lg:h-[calc(100vh+120px)] object-cover"
          />
        </div>

        {/* OVERLAY SUTIL */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent lg:to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-oxford/40 via-transparent to-transparent" />

        {/* CONTENIDO PRINCIPAL */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center pt-32 pb-8">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
            {/* BLOQUE DE TEXTO */}
            <div className="max-w-2xl text-left mb-12 md:mb-8">
              <h1 className="flex flex-col items-start uppercase tracking-tighter">
                {/* Keyword de confianza */}
                <span className="text-gold-sand text-xs md:text-sm md:mt-8  font-bold tracking-[0.4em] mb-1 drop-shadow-md bg-black/40 px-2 py-1 rounded-md md:bg-transparent">
                  Inmobiliaria en General Roca
                </span>

                {/* Título principal con gradiente parcial */}
                <span className="text-2xl md:text-4xl lg:text-4xl xl:text-5xl font-montserrat font-black leading-[1.1] drop-shadow-lg flex flex-col">
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-gold-sand to-yellow-600 font-extrabold">
                    Casas, <span className="text-white/90">Departamentos</span>
                  </span>
                  <span className="text-white font-extrabold mt-1">
                    y Loteos
                  </span>
                </span>
              </h1>

              {/* Subtítulo SEO */}
              <p className="mt-2 text-slate-200 text-sm md:text-lg lg:text-base xl:text-lg font-light leading-relaxed max-w-lg drop-shadow-md">
                Propiedades y terrenos en venta en{" "}
                <span className="text-white font-medium italic underline decoration-gold-sand/40">
                  General Roca
                </span>{" "}
                y todo el Alto Valle.
              </p>
            </div>

            {/* BUSCADOR */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl">
                <SearchBar initialProperties={allProperties} />
                {/* Detalle inferior opcional */}
                <p className="mt-3 text-white/40 text-[10px] md:text-xs uppercase tracking-[0.2em] text-center">
                  Explora las mejores oportunidades de inversión
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
