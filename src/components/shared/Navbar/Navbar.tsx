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
    <header className="navbar-container w-full shadow-sm font-montserrat">
      
      {/* --- TOP BAR (Desktop Only) --- */}
      <div className="hidden lg:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="shrink-0">
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
                <span className="text-[10px] text-blue-gray uppercase tracking-wider">Seguinos</span>
                <div className="flex gap-3 mt-0.5">
                  <a href="#" className="text-onyx hover:text-gold-sand"><Facebook size={16} /></a>
                  <a href="#" className="text-onyx hover:text-gold-sand"><Instagram size={16} /></a>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <a href="https://wa.me/5492984582082" className="flex items-center gap-3">
              <MessageCircle className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-gray">WhatsApp</span>
                <p className="text-[13px] font-semibold text-onyx">+54 9 298 4582082</p>
              </div>
            </a>

            {/* Horario */}
            <div className="flex items-center gap-3 border-l pl-8 border-gray-200">
              <Clock className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-gray">Atención</span>
                <p className="text-[13px] font-semibold text-onyx uppercase">Lun a Vie 9 - 18hs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN NAV (Blue Oxford) --- */}
      {/* Forzamos el color de fondo para evitar el "blanco" en mobile */}
      <nav 
        className="text-white relative z-10" 
        style={{ backgroundColor: '#001d3d' }}
      >
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
                  className="text-sm font-medium hover:text-gold-sand transition-colors py-5 border-b-2 border-transparent hover:border-gold-sand"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Botón Tasar / Mobile Toggle */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="hidden lg:block text-xs font-bold bg-gold-sand hover:bg-gold-hover text-oxford px-5 py-2.5 rounded-sm"
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
          className={`
          lg:hidden absolute w-full bg-[#001d3d] transition-all duration-300 ease-in-out z-50 overflow-hidden shadow-xl
          ${isOpen ? "max-h-125 border-t border-white/10" : "max-h-0"}
        `}
        >
          <div className="px-6 py-8 flex flex-col space-y-5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold uppercase tracking-wider text-white hover:text-gold-sand"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}