import Image from "next/image";
import SearchBar from "@/components/shared/SearchBar/SearchBar";
import { getUiProperties } from "@/components/server/data-access/get-ui-properties";

export default async function Hero() {
  const allProperties = await getUiProperties({ limit: 20 });

  return (
    <section className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden">
      
      {/* LA IMAGEN: Ahora es parte de la sección. 
          Al hacer scroll agresivo, la sección entera rebota con su imagen. */}
      <Image
  src="/hero-mobile.webp"
  fill
  priority
  alt="Hero mobile"
  placeholder="blur"
  blurDataURL="/hero-mobile-blur.webp"
  className="object-cover lg:hidden"
/>

<Image
  src="/bg-hero.webp"
  fill
  priority
  alt="Hero desktop"
  placeholder="blur"
  blurDataURL="/bg-hero-blur.webp"
  className="hidden lg:block object-cover"
/>


      {/* OVERLAY (El ::before que mencionaste) */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* CONTENIDO */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col items-center mb-32">
        <div className="text-center mb-8 lg:mb-12 space-y-4">
          <h1 className="text-white text-4xl xl:text-5xl font-montserrat uppercase font-black italic drop-shadow-md ">
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