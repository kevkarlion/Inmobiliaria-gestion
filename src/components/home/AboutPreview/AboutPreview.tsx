import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";

export default function AboutPreview() {
  return (
    <section className="relative w-full py-20 bg-white overflow-hidden border-t border-slate-100">
      {/* Patrón decorativo consistente con tu PropertyGrid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e1' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-350 mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Columna Texto (Izquierda para variar el ritmo visual) */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div className="space-y-4">
              {/* Cabecera Estilo PropertyGrid */}
              <div className="flex items-center gap-4">
                <h3 className="font-montserrat text-xs font-black uppercase tracking-[0.3em] text-gold-sand">
                  Nosotros
                </h3>
                <div className="w-12 h-px bg-gold-sand/30" />
              </div>

              <h2 className="font-lora text-4xl lg:text-5xl 2xl:text-6xl text-slate-900 italic leading-tight">
                Estrategia aplicada a <br />
                <span className="text-gold-sand text-3xl lg:text-4xl 2xl:text-5xl uppercase font-black tracking-tighter not-italic">
                  activos inmobiliarios.
                </span>
              </h2>

              {/* Divisor de Rombos consistente */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
                <div className="w-16 h-px bg-gold-sand/40" />
                <div className="w-2 h-2 rotate-45 border border-gold-sand bg-gold-sand/20" />
              </div>
            </div>

            <p className="font-lora text-slate-600 text-base md:text-lg leading-relaxed max-w-xl">
              Entendemos la propiedad como un{" "}
              <span className="font-bold text-slate-900 uppercase tracking-tight">
                activo estratégico
              </span>
              . Acompañamos cada operación con el rigor técnico necesario para
              asegurar que cada inmueble sea una
              <span className="font-bold text-slate-900">
                {" "}
                inversión segura
              </span>{" "}
              que potencie su patrimonio.
            </p>

            {/* Pilares Informativos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gold-sand">
                  <ShieldCheck size={20} />
                  <h4 className="font-montserrat text-xs font-black uppercase tracking-widest text-slate-900">
                    Transparencia
                  </h4>
                </div>
                <p className="font-montserrat text-xs text-slate-500 leading-loose">
                  Información clara y respaldo constante para decisiones con
                  total confianza.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gold-sand">
                  <TrendingUp size={20} />
                  <h4 className="font-montserrat text-xs font-black uppercase tracking-widest text-slate-900">
                    Visión Real
                  </h4>
                </div>
                <p className="font-montserrat text-xs text-slate-500 leading-loose">
                  Análisis de mercado estratégico para maximizar el valor de tu
                  capital.
                </p>
              </div>
            </div>

            {/* CTA Estilo tu Botón */}
            <div className="pt-6">
              <Link href="/nosotros">
                <button className="btn-cta group flex items-center gap-3">
                  CONOCÉ NUESTRO EQUIPO
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
            </div>
          </div>

          {/* Columna Imagen (Derecha) */}
          <div className="relative order-1 lg:order-2">
            <div className="relative h-112.5 lg:h-150 w-full rounded-sm overflow-hidden shadow-2xl z-10 border-12 border-white">
              <Image
                src="/img-about-home.webp"
                alt="Riquelme Propiedades"
                fill
                className="object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
            </div>

            {/* Adorno Geométrico */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-slate-900 z-0 rounded-sm hidden lg:block" />
            <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-24 h-48 border-y border-l border-gold-sand/30 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
