"use client";

import { useMemo } from "react";
import Hero from "@/components/home/Hero/Hero";
import PropertyGrid from "@/components/shared/PropertyGrid/PropertyGrid";
import { useProperties } from "@/context/PropertyContext";

export default function HomePage() {
  const { properties, loading } = useProperties();

  const opportunities = useMemo(() => {
    return properties
      .filter((p) => p.opportunity === true)
      .slice(0, 6); // Traemos un poco más para que el carrusel tenga sentido
  }, [properties]);

  return (
    <main className="min-h-screen bg-white font-montserrat">
      <Hero />

      <div className="animate-in fade-in duration-700">
        <PropertyGrid
          title="Oportunidades"
          subtitle="Propiedades con condiciones especiales, ideales para quienes buscan una decisión inteligente. 
              Inmuebles que destacan por su atractivo valor, disponibilidad inmediata o situaciones 
              particulares que representan una excelente ocasión dentro del mercado."
          properties={opportunities}
          isLoading={loading} // Pasamos el estado aquí
        />
      </div>
    </main>
  );
}