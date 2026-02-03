"use client";

import Hero from "@/components/home/Hero/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero ahora contiene: 
          1. Imagen de fondo con overlay.
          2. El mensaje principal de la marca.
          3. El componente SearchBar con toda la lógica de búsqueda.
      */}
      <Hero />

      {/* Aquí puedes añadir las siguientes secciones de la página principal:
          - Propiedades Destacadas
          - Servicios (Tasaciones, Asesoramiento)
          - Contacto
      */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <span className="text-gold-sand font-bold tracking-widest text-xs uppercase">
          Inmobiliaria Riquelme
        </span>
        <h2 className="text-oxford mt-2">Próximamente: Propiedades Destacadas</h2>
        <p className="text-blue-gray mt-4 max-w-2xl mx-auto">
          Estamos preparando una selección exclusiva de inmuebles para vos. 
          Utilizá el buscador superior para explorar nuestro catálogo actual.
        </p>
      </section>
    </main>
  );
}