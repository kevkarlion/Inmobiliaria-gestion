'use client';
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Menu, 
  X, 
  MessageCircle 
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Inicio", href: "/" },
    { name: "Oportunidad", href: "/oportunidad" },
    { name: "Venta", href: "/venta" },
    { name: "Alquiler", href: "/alquiler" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <header className="w-full shadow-sm">
      {/* --- TOP BAR (Desktop Only) --- */}
      <div className="hidden lg:block bg-white-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image 
              src="/logo-navbar.png" // Asegúrate de tener tu logo en public
              alt="Riquelme Propiedades" 
              width={180} 
              height={60} 
              className="object-contain"
            />
          </Link>

          {/* Contact Info Blocks */}
          <div className="flex flex-1 justify-end space-x-8">
            {/* Dirección */}
            <div className="flex items-center gap-3">
              <MapPin className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="label-subtitle text-[10px]! text-blue-gray">Dirección</span>
                <p className="text-[13px] font-semibold text-onyx">Calle Falsa 123, Ciudad</p>
              </div>
            </div>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/123456789" 
              target="_blank" 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <MessageCircle className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="label-subtitle text-[10px]! text-blue-gray">WhatsApp</span>
                <p className="text-[13px] font-semibold text-onyx font-montserrat">+54 9 11 1234-5678</p>
              </div>
            </a>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="label-subtitle text-[10px]! text-blue-gray">Correo</span>
                <p className="text-[13px] font-semibold text-onyx">info@riquelme.com</p>
              </div>
            </div>

            {/* Horario */}
            <div className="flex items-center gap-3 border-l pl-8 border-gray-200">
              <Clock className="text-gold-sand" size={20} />
              <div className="flex flex-col">
                <span className="label-subtitle text-[10px]! text-blue-gray">Atención</span>
                <p className="text-[13px] font-semibold text-onyx uppercase">Lun a Vie 9 - 18hs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN NAV (Blue Oxford) --- */}
      <nav className="bg-oxford text-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Mobile: Ahora usa la etiqueta Image */}
            <div className="lg:hidden shrink-0">
              <Link href="/">
                <Image 
                  src="/logo-blanco.png" // O el logo que resalte sobre azul
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

            {/* Botón CTA o Mobile Toggle */}
            <div className="flex items-center gap-4">
               <button className="hidden lg:block text-xs font-montserrat font-bold bg-gold-sand hover:bg-gold-hover text-oxford px-5 py-2.5 rounded-sm transition-all shadow-sm">
                  TASAR AHORA
               </button>
               
               {/* Mobile Button */}
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
        <div className={`
          lg:hidden absolute w-full bg-oxford transition-all duration-300 ease-in-out z-50 overflow-hidden shadow-xl
          ${isOpen ? "max-h-125 border-t border-white/10" : "max-h-0"}
        `}>
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
               <a href="tel:123456" className="flex items-center gap-3 text-gold-sand text-sm font-bold font-montserrat tracking-tight">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  LLAMAR AHORA
               </a>
               <a href="mailto:info@riquelme.com" className="flex items-center gap-3 text-gold-sand text-sm font-bold font-montserrat tracking-tight">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  ENVIAR MAIL
               </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}