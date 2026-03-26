"use client";

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
    <section className="relative min-h-[70vh] md:min-h-[50vh] lg:min-h-[40vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20 lg:pt-[206px] pb-6">
      {/* Background image */}
      <div 
        className="absolute inset-0 z-0"
      >
        <img 
          src="/bg-hero.webp" 
          alt="Background"
          className="w-full h-full object-cover opacity-15"
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-white/95 to-slate-50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 md:pt-28 lg:pt-[160px]">
        <div className="text-center max-w-2xl mx-auto">
          {/* Main headline */}
          <h1 className="font-montserrat text-3xl md:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-3">
            ¿Querés saber cuánto vale tu{" "}
            <span className="text-gold-sand">propiedad?</span>
          </h1>

          {/* Subtitle */}
          <p className="font-lora text-base md:text-base text-slate-600 italic max-w-lg mx-auto mb-6 leading-relaxed">
            Obtené una tasación precisa del mercado de General Roca. 
            Te contactamos en menos de 24 horas.
          </p>

          {/* CTA Button */}
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-montserrat font-bold py-3 px-8 uppercase text-xs tracking-[0.1em] hover:bg-gold-sand hover:text-slate-900 transition-all duration-500 shadow-lg active:scale-95"
          >
            Solicitar tasación
            <ArrowRight size={16} />
          </button>

          {/* Trust copy */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield size={14} className="text-gold-sand" />
            <span>Sin compromiso</span>
          </div>
        </div>
      </div>
    </section>
  );
}