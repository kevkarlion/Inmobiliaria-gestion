//componentes/shared/Navbar
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Clock,
  Menu,
  X,
  MessageCircle,
  Facebook,
  Instagram,
  Share2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { buildSeoListingUrl } from "@/lib/seoUrls";
import { pluralizePropertyType } from "@/lib/propertyTypeLabels";
import { trackCtaClick } from "@/components/shared/Analytics";
import type { NavMenuStructure } from "@/lib/seoUrls";

const NAV_COLOR = "#001d3d";

interface NavbarProps {
  menuStructure?: NavMenuStructure | null;
}

export default function Navbar({ menuStructure }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileVentaOpen, setMobileVentaOpen] = useState(false);
  const [mobileAlquilerOpen, setMobileAlquilerOpen] = useState(false);
  const [mobileTypeVenta, setMobileTypeVenta] = useState<string | null>(null);
  const [mobileTypeAlquiler, setMobileTypeAlquiler] = useState<string | null>(null);

  const hasVenta = (menuStructure?.venta?.length ?? 0) > 0;
  const hasAlquiler = (menuStructure?.alquiler?.length ?? 0) > 0;

  return (
    <header className="navbar-container w-full shadow-sm">
      {/* --- TOP BAR (Desktop Only) --- */}
      <div className="hidden lg:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" scroll className="shrink-0">
            <Image
              src="/logo-navbar.webp"
              alt="Riquelme Propiedades"
              width={180}
              height={60}
              className="object-contain"
              priority
            />
          </Link>

          <div className="flex flex-1 justify-end space-x-8">
            <div className="flex items-center gap-3">
              <Share2 className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-gray uppercase tracking-wider">Seguinos</span>
                <div className="flex gap-3 mt-0.5">
                  <a
                    href="https://www.facebook.com/riquelmeprop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-onyx hover:text-gold-sand transition-colors"
                  >
                    <Facebook size={16} />
                  </a>
                  <a
                    href="https://www.instagram.com/riquelme.propiedades/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-onyx hover:text-gold-sand transition-colors"
                  >
                    <Instagram size={16} />
                  </a>
                </div>
              </div>
            </div>

            <a
              href="mailto:info@riquelmeprop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border-l pl-8 border-gray-100"
            >
              <Mail className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-gray uppercase tracking-wider">Email</span>
                <p className="text-[13px] font-semibold text-onyx lowercase tracking-tight">
                  info@riquelmeprop.com
                </p>
              </div>
            </a>

            <a
              href="https://wa.me/5492984582082"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border-l pl-8 border-gray-100"
              onClick={() => trackCtaClick({ cta_type: "whatsapp", cta_location: "header" })}
            >
              <MessageCircle className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-gray uppercase tracking-wider">WhatsApp</span>
                <p className="text-[13px] font-semibold text-onyx">+54 9 298 4582082</p>
              </div>
            </a>

            <div className="flex items-center gap-3 border-l pl-8 border-gray-200">
              <Clock className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-gray uppercase tracking-wider">Atención</span>
                <p className="text-[13px] font-semibold text-onyx uppercase">Lun a Vie 9 - 18hs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN NAV --- */}
      <nav
        className="text-white relative z-40 font-montserrat"
        style={{ backgroundColor: NAV_COLOR }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="lg:hidden shrink-0">
              <button
                type="button"
                onClick={() => window.scrollTo(0, 0)}
                className="flex items-center"
                aria-label="Inicio"
              >
                <Image
                  src="/logo-blanco.png"
                  alt="Riquelme Propiedades"
                  width={140}
                  height={40}
                  className="object-contain"
                  priority
                />
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                href="/"
                scroll
                className="text-sm font-medium hover:text-gold-sand transition-colors py-5 px-3 border-b-2 border-transparent hover:border-gold-sand"
              >
                Inicio
              </Link>

              {/* Comprar dropdown */}
              {hasVenta ? (
                <div className="relative group/nav py-5">
                  <button
                    type="button"
                    className="text-sm font-medium hover:text-gold-sand transition-colors px-3 border-b-2 border-transparent hover:border-gold-sand flex items-center gap-1"
                  >
                    Comprar <ChevronDown size={14} />
                  </button>
                  <div className="absolute top-full left-0 pt-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all min-w-[220px]">
                    <div className="bg-white text-oxford rounded-b shadow-xl border-t-2 border-gold-sand py-2">
                      {/* Link para ver todas las propiedades de venta */}
                      <Link
                        href="/propiedades/venta"
                        className="block px-4 py-2 text-sm hover:bg-gold-sand/10 hover:text-gold-sand font-semibold"
                      >
                        Ver todas
                      </Link>

                      {menuStructure!.venta.map((typeEntry) => (
                        <div key={typeEntry.typeSlug} className="group/type relative">
                          <div className="flex items-center justify-between px-4 py-2 hover:bg-slate-50">
                            <span className="text-sm font-semibold">
                              {pluralizePropertyType(typeEntry.typeName)}
                            </span>
                            <ChevronRight size={14} className="text-slate-400" />
                          </div>
                          <div className="absolute left-full top-0 ml-0 opacity-0 invisible group-hover/type:opacity-100 group-hover/type:visible transition-all min-w-[180px] bg-white rounded shadow-xl border py-2 z-10">
                            {typeEntry.cities.map((city) => (
                              <Link
                                key={city.slug}
                                href={buildSeoListingUrl(typeEntry.typeSlug, "venta", city.slug)}
                                className="block px-4 py-2 text-sm hover:bg-gold-sand/10 hover:text-gold-sand"
                              >
                                {city.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/propiedades/venta"
                  scroll
                  className="text-sm font-medium hover:text-gold-sand transition-colors py-5 px-3 border-b-2 border-transparent hover:border-gold-sand"
                >
                  Comprar
                </Link>
              )}

              {/* Alquiler dropdown */}
              {hasAlquiler ? (
                <div className="relative group/nav py-5">
                  <button
                    type="button"
                    className="text-sm font-medium hover:text-gold-sand transition-colors px-3 border-b-2 border-transparent hover:border-gold-sand flex items-center gap-1"
                  >
                    Alquilar <ChevronDown size={14} />
                  </button>
                  <div className="absolute top-full left-0 pt-0 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all min-w-[220px]">
                    <div className="bg-white text-oxford rounded-b shadow-xl border-t-2 border-gold-sand py-2">
                      {/* Link para ver todas las propiedades de alquiler */}
                      <Link
                        href="/propiedades/alquiler"
                        className="block px-4 py-2 text-sm hover:bg-gold-sand/10 hover:text-gold-sand font-semibold"
                      >
                        Ver todas
                      </Link>

                      {menuStructure!.alquiler.map((typeEntry) => (
                        <div key={typeEntry.typeSlug} className="group/type relative">
                          <div className="flex items-center justify-between px-4 py-2 hover:bg-slate-50">
                            <span className="text-sm font-semibold">
                              {pluralizePropertyType(typeEntry.typeName)}
                            </span>
                            <ChevronRight size={14} className="text-slate-400" />
                          </div>
                          <div className="absolute left-full top-0 ml-0 opacity-0 invisible group-hover/type:opacity-100 group-hover/type:visible transition-all min-w-[180px] bg-white rounded shadow-xl border py-2 z-10">
                            {typeEntry.cities.map((city) => (
                              <Link
                                key={city.slug}
                                href={buildSeoListingUrl(typeEntry.typeSlug, "alquiler", city.slug)}
                                className="block px-4 py-2 text-sm hover:bg-gold-sand/10 hover:text-gold-sand"
                              >
                                {city.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/propiedades/alquiler"
                  scroll
                  className="text-sm font-medium hover:text-gold-sand transition-colors py-5 px-3 border-b-2 border-transparent hover:border-gold-sand"
                >
                  Alquilar
                </Link>
              )}

              <Link
                href="/propiedades/oportunidad"
                scroll
                className="text-sm font-medium hover:text-gold-sand transition-colors py-5 px-3 border-b-2 border-transparent hover:border-gold-sand"
              >
                Oportunidades
              </Link>
              <Link
                href="/novedades"
                className="text-sm font-medium hover:text-gold-sand transition-colors py-5 px-3 border-b-2 border-transparent hover:border-gold-sand"
              >
                Novedades
              </Link>
              <Link
                href="/nosotros"
                scroll
                className="text-sm font-medium hover:text-gold-sand transition-colors py-5 px-3 border-b-2 border-transparent hover:border-gold-sand"
              >
                Nosotros
              </Link>
              <Link
                href="/contacto"
                scroll
                className="text-sm font-medium hover:text-gold-sand transition-colors py-5 px-3 border-b-2 border-transparent hover:border-gold-sand"
              >
                Contacto
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/tasacion"
                className="hidden lg:block text-xs font-bold bg-gold-sand hover:bg-gold-hover text-oxford px-5 py-2.5 rounded-sm transition-all shadow-md active:scale-95"
              >
                TASAR AHORA
              </Link>
              <button
                type="button"
                className="lg:hidden p-2 text-gold-sand focus:outline-none z-[60]"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE MENU (accordion) --- */}
        <div
          className={`lg:hidden absolute w-full left-0 right-0 bg-oxford transition-all duration-300 ease-in-out z-50 overflow-hidden shadow-xl ${isOpen ? "max-h-[85vh] border-t border-white/10 overflow-y-auto" : "max-h-0"}`}
        >
          <div className="px-6 py-6 flex flex-col gap-1">
            <Link
              href="/"
              scroll
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand transition-colors py-2"
            >
              Inicio
            </Link>

            {/* Comprar accordion */}
            {hasVenta ? (
              <div className="border-b border-white/10 pb-2">
                <button
                  type="button"
                  onClick={() => setMobileVentaOpen(!mobileVentaOpen)}
                  className="w-full flex items-center justify-between text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand transition-colors py-2"
                >
                  Comprar <ChevronDown size={20} className={mobileVentaOpen ? "rotate-180" : ""} />
                </button>
                {mobileVentaOpen && (
                  <div className="pl-4 mt-1 space-y-1">
                    {/* Link para ver todas */}
                    <Link
                      href="/propiedades/venta"
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between rounded-md px-3 py-2 text-[13px] font-semibold uppercase tracking-wider text-gold-sand ring-1 ring-gold-sand/40 bg-gold-sand/10 hover:bg-gold-sand/15 transition-colors"
                    >
                      <span>Ver todas</span>
                      <ChevronRight size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {menuStructure!.venta.map((typeEntry) => (
                      <div key={typeEntry.typeSlug}>
                        <button
                          type="button"
                          onClick={() =>
                            setMobileTypeVenta((k) => (k === typeEntry.typeSlug ? null : typeEntry.typeSlug))
                          }
                          className="w-full flex items-center justify-between text-white/75 hover:text-gold-sand py-1.5 text-left font-normal"
                        >
                          {pluralizePropertyType(typeEntry.typeName)}
                          <ChevronRight
                            size={16}
                            className={mobileTypeVenta === typeEntry.typeSlug ? "rotate-90" : ""}
                          />
                        </button>
                        {mobileTypeVenta === typeEntry.typeSlug && (
                          <div className="pl-4 flex flex-col gap-1 pb-2 pt-1">
                            {typeEntry.cities.map((city) => (
                              <Link
                                key={city.slug}
                                href={buildSeoListingUrl(typeEntry.typeSlug, "venta", city.slug)}
                                onClick={() => {
                                  setIsOpen(false);
                                  setMobileVentaOpen(false);
                                  setMobileTypeVenta(null);
                                }}
                                className="group/city relative rounded-md px-3 py-2 text-[13px] font-medium text-white/80 ring-1 ring-white/10 bg-white/5 hover:bg-gold-sand/10 hover:text-gold-sand transition-colors"
                              >
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-gold-sand/70 opacity-80" />
                                <span className="pl-2">{city.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/propiedades/venta"
                scroll
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand py-2"
              >
                Comprar
              </Link>
            )}

            {/* Alquilar accordion */}
            {hasAlquiler ? (
              <div className="border-b border-white/10 pb-2">
                <button
                  type="button"
                  onClick={() => setMobileAlquilerOpen(!mobileAlquilerOpen)}
                  className="w-full flex items-center justify-between text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand transition-colors py-2"
                >
                  Alquilar <ChevronDown size={20} className={mobileAlquilerOpen ? "rotate-180" : ""} />
                </button>
                {mobileAlquilerOpen && (
                  <div className="pl-4 mt-1 space-y-1">
                    {/* Link para ver todas */}
                    <Link
                      href="/propiedades/alquiler"
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between rounded-md px-3 py-2 text-[13px] font-semibold uppercase tracking-wider text-gold-sand ring-1 ring-gold-sand/40 bg-gold-sand/10 hover:bg-gold-sand/15 transition-colors"
                    >
                      <span>Ver todas</span>
                      <ChevronRight size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {menuStructure!.alquiler.map((typeEntry) => (
                      <div key={typeEntry.typeSlug}>
                        <button
                          type="button"
                          onClick={() =>
                            setMobileTypeAlquiler((k) =>
                              k === typeEntry.typeSlug ? null : typeEntry.typeSlug
                            )
                          }
                          className="w-full flex items-center justify-between text-white/75 hover:text-gold-sand py-1.5 text-left font-normal"
                        >
                          {pluralizePropertyType(typeEntry.typeName)}
                          <ChevronRight
                            size={16}
                            className={mobileTypeAlquiler === typeEntry.typeSlug ? "rotate-90" : ""}
                          />
                        </button>
                        {mobileTypeAlquiler === typeEntry.typeSlug && (
                          <div className="pl-4 flex flex-col gap-1 pb-2 pt-1">
                            {typeEntry.cities.map((city) => (
                              <Link
                                key={city.slug}
                                href={buildSeoListingUrl(typeEntry.typeSlug, "alquiler", city.slug)}
                                onClick={() => {
                                  setIsOpen(false);
                                  setMobileAlquilerOpen(false);
                                  setMobileTypeAlquiler(null);
                                }}
                                className="group/city relative rounded-md px-3 py-2 text-[13px] font-medium text-white/80 ring-1 ring-white/10 bg-white/5 hover:bg-gold-sand/10 hover:text-gold-sand transition-colors"
                              >
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-gold-sand/70 opacity-80" />
                                <span className="pl-2">{city.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/propiedades/alquiler"
                scroll
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand py-2"
              >
                Alquilar
              </Link>
            )}

            <Link
              href="/propiedades/oportunidad"
              scroll
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand py-2"
            >
              Oportunidades
            </Link>
            <Link
              href="/novedades"
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand py-2"
            >
              Novedades
            </Link>
            <Link
              href="/nosotros"
              scroll
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand py-2"
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              scroll
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand py-2"
            >
              Contacto
            </Link>
            <Link
              href="/tasacion"
              scroll
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold uppercase tracking-wider text-gold-sand hover:text-white py-2"
            >
              Tasación
            </Link>

            {/* Redes sociales (mobile) */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/60 mb-3">
                Seguinos
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/riquelme.propiedades/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 text-sm font-bold text-white/90 hover:bg-gold-sand/10 hover:text-gold-sand transition-colors"
                >
                  <Instagram size={18} />
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/riquelmeprop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 text-sm font-bold text-white/90 hover:bg-gold-sand/10 hover:text-gold-sand transition-colors"
                >
                  <Facebook size={18} />
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}