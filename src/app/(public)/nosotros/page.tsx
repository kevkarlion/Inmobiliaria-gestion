// app/nosotros/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Scale, 
  Lightbulb, 
  Handshake, 
  ArrowRight 
} from 'lucide-react';

const teamMembers = [
  {
    name: 'Diego Riquelme',
    title: 'Director & Martillero Público',
    image: '/team/diego-riquelme.jpg',
  },
  {
    name: 'Ana García',
    title: 'Asesora Comercial',
    image: '/team/ana-garcia.jpg',
  },
  {
    name: 'Martín Soto',
    title: 'Gestor de Contratos',
    image: '/team/martin-soto.jpg',
  },
  {
    name: 'Carolina Paz',
    title: 'Administración & Marketing',
    image: '/team/carolina-paz.jpg',
  },
];

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-112.5 md:h-120 2xl:h-130 flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="/hero-nosotros.jpg"
          alt="Gestión Inmobiliaria Riquelme"
          fill
          className="object-cover object-center opacity-40 grayscale"
          priority
        />
        <div className="relative z-10 text-center px-6 mb-8">
          <h1 className="font-montserrat text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
            Nuestra <span className="text-gold-sand">Visión</span>
          </h1>
          <p className="font-lora text-slate-300 text-lg md:text-2xl italic max-w-2xl mx-auto">
            Estrategia aplicada a activos inmobiliarios de alto valor.
          </p>
        </div>
      </section>

      {/* --- SECCIÓN 1: QUIÉNES SOMOS (CON ESTÉTICA PROPERTYGRID) --- */}
      <section className="relative py-20 bg-slate-100 border-y border-slate-100">
        {/* Patrón decorativo del componente que te gusta */}
        <div
          className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e1' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Cabecera idéntica a tu componente */}
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
                Asesoramiento profesional, transparente y con sólido respaldo técnico.
              </p>
              {/* Divisor de rombos */}
              <div className="flex justify-center items-center gap-3">
                <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
                <div className="w-16 h-px bg-gold-sand/40" />
                <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
              </div>
            </div>
          </div>

          {/* Contenido Quiénes Somos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-12">
            <div className="space-y-6">
              <p className="font-montserrat text-slate-600 text-base md:text-lg leading-relaxed">
                Somos una empresa inmobiliaria enfocada en brindar asesoramiento estratégico. 
                Acompañamos a nuestros clientes en cada etapa del proceso, ofreciéndoles información 
                clara para que puedan tomar decisiones patrimoniales con total seguridad.
              </p>
              <p className="font-montserrat text-slate-500 text-sm md:text-base leading-relaxed border-l-4 border-gold-sand pl-6 italic">
                Nuestro compromiso es generar valor real, construyendo relaciones basadas en la seriedad, 
                el conocimiento y una atención personalizada que pone sus intereses en el centro.
              </p>
            </div>
            <div className="relative h-[400px] shadow-2xl rounded-sm overflow-hidden border-8 border-white">
              <Image
                src="/office-view.jpg"
                alt="Riquelme Propiedades"
                fill
                className="object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 2: VALORES (CARDS) --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Scale, title: 'Seriedad Operativa', desc: 'Procesos ejecutados bajo estrictos criterios legales para su tranquilidad.' },
              { icon: Lightbulb, title: 'Visión de Mercado', desc: 'Analizamos tendencias reales para asegurar inversiones con futuro.' },
              { icon: Handshake, title: 'Compromiso Directo', desc: 'Atención personalizada sin intermediarios, de profesional a profesional.' }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-slate-50 border-b-4 border-slate-200 hover:border-gold-sand transition-all duration-500 group">
                <item.icon size={48} className="text-slate-900 mb-6 group-hover:text-gold-sand transition-colors" />
                <h4 className="font-montserrat text-xl font-black uppercase tracking-tighter text-slate-900 mb-4">{item.title}</h4>
                <p className="font-lora text-slate-600 italic leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: EQUIPO (LA GRILLA QUE PEDISTE) --- */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Círculo de luz decorativo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold-sand/5 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-montserrat text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Nuestro <span className="text-gold-sand">Equipo</span>
            </h2>
            <p className="font-lora text-slate-400 italic mt-4 text-lg">Profesionales dedicados a su éxito inmobiliario.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden rounded-sm border border-white/10 group-hover:border-gold-sand transition-all duration-700">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  {/* Overlay sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h4 className="font-montserrat text-xl font-black text-white uppercase tracking-tighter mb-1 transition-colors group-hover:text-gold-sand">
                  {member.name}
                </h4>
                <p className="font-lora text-gold-sand italic text-sm tracking-widest">
                  {member.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-montserrat text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-8">
            ¿Listo para su <span className="text-gold-sand">Próxima Inversión?</span>
          </h2>
          <Link href="/contacto" className="inline-block">
            <button className="flex items-center gap-4 bg-slate-900 text-white font-montserrat font-black py-5 px-12 uppercase text-xs tracking-[0.2em] hover:bg-gold-sand hover:text-slate-900 transition-all duration-500 shadow-2xl active:scale-95">
              Hablemos hoy
              <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}