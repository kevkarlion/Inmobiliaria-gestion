import Image from "next/image";
import SearchBar from "@/components/shared/SearchBar/SearchBar";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background & Overlay */}
      <div className="absolute inset-0 z-0">
        {/* LA IMAGEN VA AQUÍ */}
        <Image
          src="/bg-hero.png" // Ruta de tu imagen en la carpeta /public
          alt="Inmobiliaria Riquelme"
          fill
          className="object-cover"
          priority // Carga la imagen con prioridad por ser el Hero
        />
        
        {/* Overlay elegante: mezcla de Oxford Blue y negro para contraste */}
       <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative bottom-25 z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-white">
            Estrategia para vender, <br />
            <span className="text-gold-sand">visión para comprar.</span>
          </h1>
        </div>

        {/* Buscador */}
        <div className="w-full max-w-5xl">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}