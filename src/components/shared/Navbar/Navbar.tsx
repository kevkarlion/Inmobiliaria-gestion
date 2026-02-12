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
    <header className="navbar-container w-full shadow-sm ">
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
            {/* Redes */}
            <div className="flex items-center gap-3">
              <Share2 className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-gray uppercase tracking-wider">
                  Seguinos
                </span>
                <div className="flex gap-3 mt-0.5">
                  <a
                    href="https://www.facebook.com/riquelmeprop?rdid=2QDa2IeJSjsrjxVN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1C6P6AShqK%2F#"
                    target="_blank"
                    className="text-onyx hover:text-gold-sand transition-colors"
                  >
                    <Facebook size={16} />
                  </a>
                  <a
                    href="https://www.instagram.com/riquelme.propiedades/"
                    target="_blank"
                    className="text-onyx hover:text-gold-sand transition-colors"
                  >
                    <Instagram size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <a
              href="mailto:info@riquelmepropiedades.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border-l pl-8 border-gray-100"
            >
              <Mail className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-gray uppercase tracking-wider">
                  Email
                </span>
                <p className="text-[13px] font-semibold text-onyx lowercase tracking-tight">
                  diegoriquelme91@gmail.com
                </p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/5492984582082"
              target="_blank"
              className="flex items-center gap-3 border-l pl-8 border-gray-100"
            >
              <MessageCircle className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-gray uppercase tracking-wider">
                  WhatsApp
                </span>
                <p className="text-[13px] font-semibold text-onyx">
                  +54 9 298 4582082
                </p>
              </div>
            </a>

            {/* Horario */}
            <div className="flex items-center gap-3 border-l pl-8 border-gray-200">
              <Clock className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-gray uppercase tracking-wider">
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

      {/* --- MAIN NAV --- */}
      <nav
        className="text-white relative z-10 font-montserrat"
        style={{ backgroundColor: "#001d3d" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo Mobile */}
            <div className="lg:hidden shrink-0">
              <button
                onClick={() => window.scrollTo(0, 0)}
                className="flex items-center"
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
            <div className="hidden lg:flex items-center space-x-10">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  scroll
                  className="text-sm font-medium hover:text-gold-sand transition-colors py-5 border-b-2 border-transparent hover:border-gold-sand"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Botón */}
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/5492984582082"
                target="_blank"
                className="hidden lg:block text-xs font-bold bg-gold-sand hover:bg-gold-hover text-oxford px-5 py-2.5 rounded-sm transition-all shadow-md active:scale-95"
              >
                TASAR AHORA
              </a>
              <button
                className="lg:hidden p-2 text-gold-sand focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        <div
          className={`lg:hidden absolute w-full bg-oxford transition-all duration-300 ease-in-out z-50 overflow-hidden shadow-xl
          ${isOpen ? "max-h-125 border-t border-white/10" : "max-h-0"}`}
        >
          <div className="px-6 py-8 flex flex-col space-y-5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                scroll
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* Redes mobile */}
            <div className="flex flex-col gap-4 mt-6 border-t border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <Share2 className="text-gold-sand" size={20} />
                <span className="text-white font-medium text-sm uppercase tracking-wide">
                  Seguinos
                </span>
              </div>
              <div className="flex gap-4 pl-5">
                <a
                  href="https://www.facebook.com/riquelmeprop?rdid=2QDa2IeJSjsrjxVN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1C6P6AShqK%2F#"
                  target="_blank"
                  className="text-white hover:text-gold-sand transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/riquelme.propiedades/"
                  target="_blank"
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
