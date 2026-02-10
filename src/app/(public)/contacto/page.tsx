// app/contacto/page.tsx
"use client";

import React from "react";
import {
  Mail,
  MessageCircle,
  Clock,
  Facebook,
  Instagram,
  
  ArrowRight,
} from "lucide-react";

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-white pt-32 lg:pt-52 pb-0">
      {/* Patrón decorativo de fondo */}
      <div
        className="absolute inset-0 z-0 opacity-[0.3] pointer-events-none h-150"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e1' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- CABECERA --- */}
        <div className="flex flex-col items-center text-center mb-20 space-y-5">
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center justify-center gap-6">
              <div className="hidden md:flex items-center">
                <div className="w-12 lg:w-20 h-px bg-slate-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-gold-sand ml-2" />
              </div>
              <h1 className="font-montserrat text-4xl md:text-5xl 2xl:text-6xl font-black text-slate-900 uppercase tracking-tighter shrink-0">
                Contacto
              </h1>
              <div className="hidden md:flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-sand mr-2" />
                <div className="w-12 lg:w-20 h-px bg-slate-200" />
              </div>
            </div>
            <p className="font-lora text-slate-600 text-sm md:text-xl leading-relaxed max-w-2xl mx-auto italic">
              Canales de atención directa para una gestión eficiente de sus
              activos.
            </p>
            <div className="flex justify-center items-center gap-3">
              <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
              <div className="w-16 h-px bg-gold-sand/40" />
              <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
            </div>
          </div>
        </div>

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
            href="mailto:diegoriquelme91@gmail.com"
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
              diegoriquelme91@gmail.com{" "}
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-sand/10 rounded-full blur-[100px]" />
      </section>
    </main>
  );
}
