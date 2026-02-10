import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";

// Definimos la interfaz para evitar el error de TypeScript
interface ContentProps {
  isMobile: boolean;
}

export default function AboutPreview() {
  return (
    <section className="relative w-full py-20 bg-white overflow-hidden border-t border-slate-100">
      {/* Patrón decorativo */}
      <div
        className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e1' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-350 mx-auto px-6 relative z-9">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* BLOQUE IMAGEN + TEXTO MOBILE */}
          <div className="relative order-1 lg:order-2 h-187.5 sm:h-162.5 lg:h-150 w-full group">
            <div className="relative h-full w-full rounded-sm overflow-hidden shadow-2xl z-10 lg:border-12 border-white">
              <Image
                src="/img-about-home.webp"
                alt="Riquelme Propiedades"
                fill
                priority
                className="object-cover grayscale-[0.2] lg:group-hover:grayscale-0 transition-all duration-700"
              />
              {/* Overlay más alto para proteger el texto h2 y h3 que están arriba */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/80 to-slate-900/40 lg:hidden" />
            </div>

            {/* ADORNOS (Solo Desktop) */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-slate-900 z-0 rounded-sm hidden lg:block" />
            <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-24 h-48 border-y border-l border-gold-sand/30 hidden lg:block" />

            {/* CONTENIDO MOBILE: Alineado al fondo con padding superior para que respire */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 pb-12 lg:hidden">
              <Content isMobile={true} />
            </div>
          </div>

          {/* BLOQUE TEXTO DESKTOP */}
          <div className="hidden lg:flex flex-col gap-8 order-2 lg:order-1">
            <Content isMobile={false} />
          </div>

        </div>
      </div>
    </section>
  );
}

function Content({ isMobile }: ContentProps) {
  const textColor = isMobile ? "text-white" : "text-slate-900";
  const subTextColor = isMobile ? "text-slate-300" : "text-slate-500";
  const pColor = isMobile ? "text-slate-100" : "text-slate-600";

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="font-montserrat text-xs font-black uppercase tracking-[0.3em] text-gold-sand">
            Nosotros
          </h3>
          <div className="w-12 h-px bg-gold-sand/30" />
        </div>

        <h2 className={`font-montserrat text-3xl lg:text-5xl italic leading-tight ${textColor}`}>
          Estrategia aplicada a <br />
          <span className="text-gold-sand text-2xl lg:text-4xl 2xl:text-5xl uppercase font-black tracking-tighter not-italic">
            activos inmobiliarios.
          </span>
        </h2>

        {/* Divisor de Rombos */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
          <div className="w-16 h-px bg-gold-sand/40" />
          <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
        </div>
      </div>

      <p className={`font-lora text-base md:text-lg leading-relaxed max-w-xl ${pColor}`}>
        Entendemos la propiedad como un{" "}
        <span className={`font-bold uppercase tracking-tight ${textColor}`}>
          activo estratégico
        </span>
        . Acompañamos cada operación con el rigor técnico necesario para
        asegurar que cada inmueble sea una{" "}
        <span className={`font-bold ${textColor}`}>inversión segura</span> que potencie su patrimonio.
      </p>

      {/* Pilares Informativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gold-sand">
            <ShieldCheck size={20} />
            <h4 className={`font-montserrat text-xs font-black uppercase tracking-widest ${textColor}`}>
              Transparencia
            </h4>
          </div>
          <p className={`font-montserrat text-[11px] leading-loose ${subTextColor}`}>
            Información clara y respaldo constante para decisiones con total confianza.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gold-sand">
            <TrendingUp size={20} />
            <h4 className={`font-montserrat text-xs font-black uppercase tracking-widest ${textColor}`}>
              Visión Real
            </h4>
          </div>
          <p className={`font-montserrat text-[11px] leading-loose ${subTextColor}`}>
            Análisis de mercado estratégico para maximizar el valor de tu capital.
          </p>
        </div>
      </div>

      <div className="pt-6">
        <Link href="/nosotros">
          <button className={`btn-cta group flex items-center gap-3 ${isMobile ? 'bg-gold-sand text-slate-900 px-6 py-3 rounded-sm font-black text-[10px]' : ''}`}>
            CONOCÉ NUESTRO EQUIPO
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
}