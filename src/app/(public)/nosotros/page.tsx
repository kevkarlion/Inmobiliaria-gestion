"use client";

import React from "react";
import Image from "next/image";
import {
  Scale,
  Lightbulb,
  Handshake,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import BackgroundLayer from "@/components/shared/BackgroundLayer/BackgroundLayer";

interface TeamMember {
  name: string;
  title: string;
  image: string;
  registration?: string; // Propiedad opcional para la matrícula
}

const teamMembers: TeamMember[] = [
  {
    name: "Diego Riquelme",
    title: "Martillero Público y Corredor Inmobiliario",
    image: "/diego.webp",
    registration: "Mat. N° 361-RP-2021", // Ejemplo de matrícula
  },
  { 
    name: "Fernanda Huebra", 
    title: "Asesora Inmobiliaria", 
    image: "/chica1.webp" 
  },
  { 
    name: "Stefy Anaya", 
    title: "Asesora Inmobiliaria", 
    image: "/chica2.webp" 
  },
];

interface NosotrosContentProps {
  isMobile: boolean;
}

export default function NosotrosPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* --- BACKGROUND LAYER --- */}
      <BackgroundLayer
        src="/nosotros.webp"
        grayscale={true}
        overlayColor="black"
        overlayOpacity={0.4}
      />

      {/* --- HERO SECTION --- */}
      <section className="relative h-112.5 md:h-135 2xl:h-150 flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-6 mt-12">
          <h1 className="font-montserrat text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
            Nuestra <span className="text-gold-sand">Visión</span>
          </h1>
          <p className="font-lora text-slate-300 text-lg md:text-2xl italic max-w-2xl mx-auto">
            Estrategia aplicada a activos inmobiliarios de alto valor.
          </p>
        </div>
      </section>

      {/* --- SECCIÓN 1: QUIÉNES SOMOS --- */}
      <section className="relative py-20 bg-slate-100 border-y border-slate-100">
        <div
          className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e1' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-16 space-y-5">
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-center gap-6">
                <div className="hidden md:flex items-center">
                  <div className="w-12 lg:w-20 h-px bg-slate-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-sand ml-2" />
                </div>
                <h2 className="font-montserrat text-3xl md:text-4xl 2xl:text-5xl font-black text-slate-900 uppercase tracking-tighter shrink-0">
                  Nuestra Firma
                </h2>
                <div className="hidden md:flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-sand mr-2" />
                  <div className="w-12 lg:w-20 h-px bg-slate-200" />
                </div>
              </div>
              <p className="font-lora text-slate-600 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto italic">
                Asesoramiento profesional, transparente y con sólido respaldo
                técnico.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-12">
            <div className="relative order-1 lg:order-2 h-150 sm:h-125 lg:h-100 w-full group">
              <div className="relative h-full w-full rounded-sm overflow-hidden shadow-2xl z-10 lg:border-8 border-white">
                <Image
                  src="/nosotros-section.webp"
                  alt="Riquelme Propiedades"
                  fill
                  className="object-cover grayscale"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/80 to-slate-900/40 lg:hidden" />
              </div>
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 lg:hidden">
                <NosotrosContent isMobile={true} />
              </div>
            </div>
            <div className="hidden lg:block order-2 lg:order-1">
              <NosotrosContent isMobile={false} />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 2: VALORES --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Scale,
                title: "Seriedad Operativa",
                desc: "Procesos ejecutados bajo estrictos criterios legales para su tranquilidad.",
              },
              {
                icon: Lightbulb,
                title: "Visión de Mercado",
                desc: "Analizamos tendencias reales para asegurar inversiones con futuro.",
              },
              {
                icon: Handshake,
                title: "Compromiso Directo",
                desc: "Atención personalizada sin intermediarios, de profesional a profesional.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-10 bg-slate-50 border-b-4 border-slate-200 hover:border-gold-sand transition-all duration-500 group"
              >
                <item.icon
                  size={48}
                  className="text-slate-900 mb-6 group-hover:text-gold-sand transition-colors"
                />
                <h4 className="font-montserrat text-xl font-black uppercase tracking-tighter text-slate-900 mb-4">
                  {item.title}
                </h4>
                <p className="font-lora text-slate-600 italic leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: EQUIPO --- */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold-sand/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-montserrat text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Nuestro <span className="text-gold-sand">Equipo</span>
            </h2>
            <p className="font-lora text-slate-400 italic mt-4 text-lg">
              Profesionales dedicados a su éxito inmobiliario.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative w-full aspect-3/4 mb-6 overflow-hidden rounded-sm border border-white/10 group-hover:border-gold-sand transition-all duration-700">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h4 className="font-montserrat text-xl font-black text-white uppercase tracking-tighter mb-1 transition-colors group-hover:text-gold-sand">
                  {member.name}
                </h4>
                <p className="font-lora text-gold-sand italic text-sm tracking-widest uppercase">
                  {member.title}
                </p>
                {/* Renderizado condicional de la matrícula */}
                {member.registration && (
                  <p className="font-montserrat text-slate-500 text-[10px] mt-2 tracking-widest uppercase">
                    {member.registration}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-montserrat text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-8">
            ¿Listo para su{" "}
            <span className="text-gold-sand">Próxima Inversión?</span>
          </h2>
          <a
            href="https://wa.me/5492984582082"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="flex items-center gap-4 bg-slate-900 text-white font-montserrat font-black py-5 px-12 uppercase text-xs tracking-[0.2em] hover:bg-gold-sand hover:text-slate-900 transition-all duration-500 shadow-2xl active:scale-95 group">
              <MessageCircle
                size={20}
                className="text-gold-sand group-hover:text-slate-900 transition-colors"
              />
              Hablemos hoy
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </a>
        </div>
      </section>
    </main>
  );
}

function NosotrosContent({ isMobile }: NosotrosContentProps) {
  const mainTextColor = isMobile ? "text-slate-100" : "text-slate-600";
  const quoteTextColor = isMobile ? "text-slate-300" : "text-slate-500";
  const boldTextColor = isMobile ? "text-white" : "text-slate-900";

  return (
    <div className="space-y-6">
      <p className={`font-montserrat text-base md:text-lg leading-relaxed ${mainTextColor}`}>
        Somos una empresa inmobiliaria enfocada en brindar{" "}
        <span className={`font-bold ${boldTextColor}`}>
          asesoramiento estratégico
        </span>
        . Acompañamos a nuestros clientes en cada etapa del proceso,
        ofreciéndoles información clara para que puedan tomar decisiones
        patrimoniales con total seguridad.
      </p>
      <p className={`font-montserrat text-sm md:text-base leading-relaxed border-l-4 border-gold-sand pl-6 italic ${quoteTextColor}`}>
        Nuestro compromiso es generar valor real, construyendo relaciones
        basadas en la seriedad, el conocimiento y una atención personalizada que
        pone sus intereses en el centro.
      </p>
    </div>
  );
}