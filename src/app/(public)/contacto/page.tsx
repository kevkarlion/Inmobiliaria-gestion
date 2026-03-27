// app/contacto/page.tsx
import React from "react";
import Image from "next/image";
import {
  Mail,
  MessageCircle,
  Clock,
  Facebook,
  Instagram,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contacto - Inmobiliaria en General Roca",
  description:
    "Contactá a Riquelme Propiedades en General Roca, Río Negro. Atención personalizada para venta, alquiler y tasación de propiedades.",
  alternates: {
    canonical: getCanonicalUrl("/contacto"),
  },
};

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-2 sm:pb-4">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')",
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
            Canales de atención
          </p>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 sm:mb-4 uppercase tracking-tight text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
            Contacto
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white/80">
            Canales de atención directa para una gestión eficiente de sus activos.
          </p>

          {/* Decorative element */}
          <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
            <div className="w-8 h-px bg-[#e6b255]" />
            <div className="w-2 h-2 rounded-full bg-[#e6b255]" />
            <div className="w-8 h-px bg-[#e6b255]" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* --- GRILLA DE CONTACTO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {/* WhatsApp Card */}
          <a
            href="https://wa.me/5492984582082"
            target="_blank"
            className="group p-10 bg-slate-50 border-b-4 border-slate-200 hover:border-gold-sand transition-all duration-500"
          >
            <div className="w-14 h-14 bg-slate-900 flex items-center justify-center text-gold-sand mb-8 group-hover:scale-110 transition-transform">
              <MessageCircle size={28} />
            </div>
            <h4 className="font-montserrat text-xl font-black uppercase tracking-tighter text-slate-900 mb-2">
              WhatsApp
            </h4>
            <p className="font-lora text-slate-500 italic mb-6">
              Atención inmediata vía chat.
            </p>
            <span className="flex items-center gap-2 font-montserrat text-sm font-bold text-slate-900">
              +54 9 298 4582082{" "}
              <ArrowRight size={16} className="text-gold-sand" />
            </span>
          </a>

          {/* Email Card */}
          <a
            href="mailto:info@riquelmeprop.com"
            className="group p-10 bg-slate-50 border-b-4 border-slate-200 hover:border-gold-sand transition-all duration-500"
          >
            <div className="w-14 h-14 bg-slate-900 flex items-center justify-center text-gold-sand mb-8 group-hover:scale-110 transition-transform">
              <Mail size={28} />
            </div>
            <h4 className="font-montserrat text-xl font-black uppercase tracking-tighter text-slate-900 mb-2">
              Email
            </h4>
            <p className="font-lora text-slate-500 italic mb-6">
              Consultas y documentación.
            </p>
            <span className="flex items-center gap-2 font-montserrat text-sm font-bold text-slate-900">
              info@riquelmeprop.com{" "}
              <ArrowRight size={16} className="text-gold-sand" />
            </span>
          </a>

          {/* Horario/Atención Card */}
          <div className="p-10 bg-slate-900 border-b-4 border-gold-sand shadow-2xl">
            <div className="w-14 h-14 bg-gold-sand flex items-center justify-center text-slate-900 mb-8">
              <Clock size={28} />
            </div>
            <h4 className="font-montserrat text-xl font-black uppercase tracking-tighter text-white mb-2">
              Atención
            </h4>
            <p className="font-lora text-slate-400 italic mb-6">
              Disponibilidad operativa.
            </p>
            <span className="block font-montserrat text-sm font-bold text-gold-sand uppercase tracking-widest">
              Lun a Vie: 9 — 18hs
            </span>
          </div>
        </div>

        {/* --- REDES SOCIALES (Misma estética PropertyGrid) --- */}
        <div className="py-16 border-t border-slate-100">
          {/* Quitamos justify-between y usamos un gap controlado para que estén cerca */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-12">
            {/* Grupo de Texto */}
            <div className="text-center md:text-left">
              <h3 className="font-montserrat text-2xl font-black uppercase tracking-tighter text-slate-900 mb-1">
                Seguinos en <span className="text-gold-sand">Redes</span>
              </h3>
              <p className="font-lora text-slate-500 italic text-sm">
                Novedades del mercado inmobiliario.
              </p>
            </div>

            {/* Grupo de Iconos: Ahora están pegados al texto en desktop */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/riquelmeprop"
                target="_blank"
                className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-sm"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/riquelme.propiedades/"
                target="_blank"
                className="w-11 h-11 flex items-center justify-center bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-sm"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* --- TASACIÓN CTA --- */}
      <section className="py-24 bg-oxford relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-montserrat text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">
            ¿Desea conocer el valor <br /> de su{" "}
            <span className="text-gold-sand">Propiedad?</span>
          </h2>
          <a
            href="https://wa.me/5492984582082?text=Hola!%20Me%20gustaría%20solicitar%20una%20tasación."
            target="_blank"
            className="inline-flex items-center gap-4 bg-gold-sand text-slate-900 font-montserrat font-black py-5 px-12 uppercase text-xs tracking-[0.2em] hover:bg-white transition-all duration-500 shadow-2xl active:scale-95"
          >
            Solicitar Tasación
            <ArrowRight size={18} />
          </a>
        </div>
        {/* Glow decorativo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-gold-sand/10 rounded-full blur-[100px]" />
      </section>
    </main>
  );
}
