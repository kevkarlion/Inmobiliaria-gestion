import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/config";
import {
  Scale,
  Lightbulb,
  Handshake,
  ArrowRight,
  MessageCircle,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Nosotros - Riquelme Propiedades en General Roca",
  description:
    "Conocé al equipo de Riquelme Propiedades, inmobiliaria en General Roca, Río Negro. Experiencia profesional en venta y alquiler de propiedades de alto valor.",
  alternates: {
    canonical: getCanonicalUrl("/nosotros"),
  },
};

interface TeamMember {
  name: string;
  title: string;
  image: string;
  registration?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  whatsapp?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Diego Riquelme",
    title: "Martillero Público y Corredor Inmobiliario",
    image: "/diego.webp",
    registration: "Mat. N° 361-RP-2021",
    whatsapp: "https://wa.me/5492984582082",
  },
  {
    name: "Candela Bonfanti",
    title: "Asesora Inmobiliaria",
    image: "/candela-bonfanti.webp",
    
  },
  {
    name: "Fernanda Huebra",
    title: "Asesora Inmobiliaria",
    image: "/chica1.webp",
    whatsapp: "https://wa.me/5492984396785"
  },
  {
    name: "Kevin Riquelme",
    title: "Asesor Inmobiliario & Estrategia Digital",
    image: "/kevin-riquelme.webp",
    instagram: "https://www.instagram.com/riquelmekevinandres?igsh=MWY1MXZ4cHA2eGcyYw%3D%3D&utm_source=qr",
    facebook: "https://www.facebook.com/profile.php?id=61577873777985",
    // linkedin: "https://www.linkedin.com/in/usuario",
    whatsapp: "https://wa.me/5492984252859",
  },
];

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.25 6.23 2.25 11.57c0 2.03.66 3.91 1.79 5.45L2 22l5.16-1.7a10.2 10.2 0 0 0 4.88 1.25h.01c5.46 0 9.79-4.23 9.79-9.57C21.84 6.23 17.5 2 12.04 2Zm-.02 17.14h-.01c-1.54 0-3.04-.42-4.35-1.22l-.31-.18-3.06 1.01 1-2.96-.2-.31a7.6 7.6 0 0 1-1.2-4.09c0-4.19 3.46-7.6 7.7-7.6 4.23 0 7.68 3.41 7.68 7.6 0 4.19-3.45 7.6-7.68 7.6Zm4.21-5.67c-.23-.12-1.37-.7-1.58-.78-.21-.08-.36-.12-.5.12-.15.23-.57.78-.7.94-.13.16-.26.17-.49.06-.23-.12-.96-.37-1.83-1.18-.68-.61-1.14-1.36-1.27-1.59-.13-.23-.01-.35.1-.47.1-.1.23-.26.34-.39.11-.13.15-.23.23-.39.08-.16.04-.29-.02-.41-.06-.12-.5-1.2-.68-1.64-.18-.44-.36-.37-.5-.38h-.43c-.15 0-.4.06-.61.29-.21.23-.8.78-.8 1.9 0 1.12.82 2.2.94 2.35.12.16 1.6 2.5 3.88 3.41.54.23.96.37 1.29.47.54.17 1.03.14 1.42.08.43-.06 1.37-.56 1.57-1.11.2-.55.2-1.02.14-1.11-.06-.09-.21-.15-.44-.27Z"
      />
    </svg>
  );
}

interface NosotrosContentProps {
  isMobile: boolean;
}

export default function NosotrosPage() {
  return (
    <main className="min-h-screen relative">
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-2 sm:pb-4">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale"
          style={{
            backgroundImage: "url('/nosotros.webp')",
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
            Nuestra firma
          </p>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 sm:mb-4 uppercase tracking-tight text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
            Nuestra <span className="text-gold-sand">Visión</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white/80">
            Estrategia aplicada a activos inmobiliarios de alto valor.
          </p>

          {/* Decorative element */}
          <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
            <div className="w-8 h-px bg-[#e6b255]" />
            <div className="w-2 h-2 rounded-full bg-[#e6b255]" />
            <div className="w-8 h-px bg-[#e6b255]" />
          </div>
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
          {/* Grid responsive: 1 col en mobile, 2 o 3 según par/impar en desktop */}
          <div
            className={`grid grid-cols-1 gap-10 md:gap-12 lg:gap-16 justify-items-center ${
              teamMembers.length % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-3"
            }`}
          >
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="w-full max-w-[320px] sm:w-72 text-center group"
              >
                <div className="relative w-full aspect-3/4 mb-6 overflow-hidden rounded-sm border border-white/10 group-hover:border-gold-sand transition-all duration-700 mx-auto">
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
                {member.registration && (
                  <p className="font-montserrat text-slate-500 text-[10px] mt-2 tracking-widest uppercase">
                    {member.registration}
                  </p>
                )}
                {(member.instagram ||
                  member.facebook ||
                  member.linkedin ||
                  member.whatsapp) && (
                  <div className="mt-4 flex items-center justify-center gap-4 text-slate-400">
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Instagram de ${member.name}`}
                        className="hover:text-gold-sand transition-colors"
                      >
                        <Instagram size={20} />
                      </a>
                    )}
                    {member.facebook && (
                      <a
                        href={member.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Facebook de ${member.name}`}
                        className="hover:text-gold-sand transition-colors"
                      >
                        <Facebook size={20} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn de ${member.name}`}
                        className="hover:text-gold-sand transition-colors"
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                    {member.whatsapp && (
                      <a
                        href={member.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp de ${member.name}`}
                        className="hover:text-gold-sand transition-colors"
                      >
                        <WhatsappIcon className="h-5 w-5" />
                      </a>
                    )}
                  </div>
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
      <p
        className={`font-montserrat text-base md:text-lg leading-relaxed ${mainTextColor}`}
      >
        Somos una empresa inmobiliaria enfocada en brindar{" "}
        <span className={`font-bold ${boldTextColor}`}>
          asesoramiento estratégico
        </span>
        . Acompañamos a nuestros clientes en cada etapa del proceso,
        ofreciéndoles información clara para que puedan tomar decisiones
        patrimoniales con total seguridad.
      </p>
      <p
        className={`font-montserrat text-sm md:text-base leading-relaxed border-l-4 border-gold-sand pl-6 italic ${quoteTextColor}`}
      >
        Nuestro compromiso es generar valor real, construyendo relaciones
        basadas en la seriedad, el conocimiento y una atención personalizada que
        pone sus intereses en el centro.
      </p>
    </div>
  );
}
