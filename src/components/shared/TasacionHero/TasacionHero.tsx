"use client";

import Image from "next/image";
import { ArrowRight, Shield } from "lucide-react";

export default function TasacionHero() {
  // Smooth scroll to form
  const scrollToForm = () => {
    const formElement = document.getElementById("tasacion-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-2 sm:pb-4">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bg-tasacion.webp')",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001d3d]/80 via-[#001d3d]/60 to-[#001d3d]/90" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e6b255] via-[#d4a045] to-[#e6b255]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-16 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="relative w-20 h-8 sm:w-28 sm:h-10">
            <Image
              src="/logo-blanco.webp"
              alt="Riquelme Propiedades"
              fill
              className="object-contain object-center brightness-150"
            />
          </div>
        </div>

        {/* Subtitle */}
        <p className="font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-2 sm:mb-3 text-[#e6b255]">
          Tasación profesional
        </p>

        {/* Main headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 sm:mb-4 uppercase tracking-tight text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
          ¿Cuánto vale tu<br className="hidden sm:block" /> propiedad?
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white/80">
          Obtené una tasación precisa del mercado de General Roca. 
          Te contactamos en menos de 24 horas.
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToForm}
          className="inline-flex items-center gap-2 bg-gold-sand text-oxford font-montserrat font-bold py-3 px-8 uppercase text-xs tracking-widest hover:bg-white transition-all duration-500 shadow-lg active:scale-95 mt-6 sm:mt-8"
        >
          Solicitar tasación
          <ArrowRight size={16} />
        </button>

        {/* Trust copy */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
          <div className="w-8 h-px bg-[#e6b255]" />
          <Shield size={14} className="text-[#e6b255]" />
          <div className="w-8 h-px bg-[#e6b255]" />
        </div>
        <span className="text-xs text-white/60 mt-2 block">Sin compromiso</span>
      </div>
    </section>
  );
}
