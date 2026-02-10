"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  Clock,
  Menu,
  X,
  MessageCircle,
  Facebook,
  Instagram,
  Share2, // Usado como ícono de "redes"
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Inicio", href: "/" },
    { name: "Oportunidad", href: "/search-type/oportunidad" },
    { name: "Venta", href: "/search-type/venta" },
    { name: "Alquiler", href: "/search-type/alquiler" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <header className="w-full shadow-sm fixed top-0 left-0 z-50 bg-oxford">
      {/* --- TOP BAR (Desktop Only) --- */}
      <div className="hidden lg:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo-navbar.png"
              alt="Riquelme Propiedades"
              width={180}
              height={60}
              className="object-contain"
            />
          </Link>

          {/* Contact Info Blocks */}
          <div className="flex flex-1 justify-end space-x-8">
            {/* Redes Sociales (Reemplaza Dirección) */}
            <div className="flex items-center gap-3">
              <Share2 className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="label-subtitle text-[10px]! text-blue-gray uppercase tracking-wider">
                  Seguinos
                </span>
                <div className="flex gap-3 mt-0.5">
                  <a
                    href="https://www.facebook.com/riquelmeprop?rdid=PADFXgf9WXGoL9Ql&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1C6P6AShqK%2F#"
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

            {/* WhatsApp */}
            <a
              href="https://wa.me/5492984582082"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <MessageCircle className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="label-subtitle text-[10px]! text-blue-gray">
                  WhatsApp
                </span>
                <p className="text-[13px] font-semibold text-onyx font-montserrat">
                  +54 9 298 4582082
                </p>
              </div>
            </a>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="label-subtitle text-[10px]! text-blue-gray">
                  Correo
                </span>
                <a
                  href="mailto:diegoriquelme91@gmail.com?subject=Consulta%20Inmobiliaria"
                  className="text-[13px] font-semibold text-onyx hover:text-gold-sand transition-colors duration-200"
                >
                  diegoriquelme91@gmail.com
                </a>
              </div>
            </div>

            {/* Horario */}
            <div className="flex items-center gap-3 border-l pl-8 border-gray-200">
              <Clock className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="label-subtitle text-[10px]! text-blue-gray">
                  Atención
                </span>
                <p className="text-[13px] font-semibold text-onyx uppercase">
                  Lun a Vie 9 - 18hs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN NAV (Blue Oxford) --- */}
      <nav className="bg-oxford text-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo Mobile */}
            <div className="lg:hidden shrink-0">
              <Link href="/">
                <Image
                  src="/logo-blanco.png"
                  alt="Riquelme Propiedades"
                  width={140}
                  height={40}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-10">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-inter text-sm font-medium tracking-wide hover:text-gold-sand transition-colors py-5 border-b-2 border-transparent hover:border-gold-sand"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Tasar Ahora / Mobile Toggle */}
            <div className="flex items-center gap-4">
              {/* Botón Tasar (Desktop) */}
              <a
                href="https://wa.me/5492984582082?text=Hola!%20Me%20gustaría%20solicitar%20una%20tasación%20de%20mi%20propiedad."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:block text-xs font-montserrat font-bold bg-gold-sand hover:bg-gold-hover text-oxford px-5 py-2.5 rounded-sm transition-all shadow-sm text-center"
              >
                TASAR AHORA
              </a>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-gold-sand hover:text-white transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        <div
          className={`
          lg:hidden absolute w-full bg-oxford transition-all duration-300 ease-in-out z-50 overflow-hidden shadow-xl
          ${isOpen ? "max-h-125 border-t border-white/10" : "max-h-0"}
        `}
        >
          <div className="px-6 py-8 flex flex-col space-y-5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="font-montserrat text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand transition-colors"
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-white/10 flex flex-col space-y-4">
              <a
                href="tel:5492984582082"
                className="flex items-center gap-3 text-gold-sand text-sm font-bold font-montserrat tracking-tight"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Phone size={16} />
                </div>
                LLAMAR AHORA
              </a>
              <div className="flex gap-4 pl-1">
                <a
                  href="https://www.facebook.com/riquelmeprop?rdid=2QDa2IeJSjsrjxVN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1C6P6AShqK%2F#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gold-sand transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/riquelme.propiedades/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gold-sand transition-colors"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
