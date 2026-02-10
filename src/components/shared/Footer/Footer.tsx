import React from "react";
import Link from "next/link";
import { Instagram, MessageCircle, Facebook } from "lucide-react"; 
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-oxford text-white border-t border-white/10">
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-sand/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Columna 1: Logo y Frase */}
        <div className="flex flex-col gap-4">
          <div className="w-40 h-16">
            <div className="relative w-full h-full">
              <Image
                src="/logo-blanco.png"
                alt="Riquelme Propiedades"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed max-w-xs">
            Expertos en gestión inmobiliaria. Encontrá el espacio ideal para tu próximo proyecto, hogar o inversión.
          </p>
        </div>

        {/* Columna 2: Menú de Navegación */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-sand">Explorar</h3>
          <nav className="flex flex-col gap-3 text-xs uppercase tracking-widest">
            <Link href="/" className="text-white/70 hover:text-gold-sand transition w-fit">
              Inicio
            </Link>
            <Link href="/search-type/venta" className="text-white/70 hover:text-gold-sand transition w-fit">
              Ventas
            </Link>
            <Link href="/search-type/alquiler" className="text-white/70 hover:text-gold-sand transition w-fit">
              Alquileres
            </Link>
            <Link href="/search-type/oportunidad" className="text-white/70 hover:text-gold-sand transition w-fit">
              Oportunidades
            </Link>
            <Link href="/contacto" className="text-white/70 hover:text-gold-sand transition w-fit">
              Contacto
            </Link>
          </nav>
        </div>

        {/* Columna 3: Redes Sociales */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-sand">Nuestras redes</h3>
          <div className="flex gap-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/5492984582082?text=Hola!%20Me%20contacto%20desde%20la%20web."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-white/20 text-white hover:bg-gold-sand hover:text-oxford transition-all group"
              aria-label="WhatsApp"
            >
              <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/riquelmeprop?rdid=2QDa2IeJSjsrjxVN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1C6P6AShqK%2F#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-white/20 text-white hover:bg-gold-sand hover:text-oxford transition-all group"
              aria-label="Facebook"
            >
              <Facebook size={20} className="group-hover:scale-110 transition-transform" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/riquelme.propiedades/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-white/20 text-white hover:bg-gold-sand hover:text-oxford transition-all group"
              aria-label="Instagram"
            >
              <Instagram size={20} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>
          <p className="text-[10px] text-white/40 italic">
            Seguinos para ver los nuevos ingresos diarios.
          </p>
        </div>

      </div>

      {/* Copyright & Firma */}
      <div className="border-t border-white/5 py-6 flex flex-col items-center gap-2">
        <p className="text-center text-[10px] text-white/40 tracking-[0.3em] uppercase">
          © {new Date().getFullYear()} Riquelme Propiedades · Gestión Inmobiliaria
        </p>
        <p className="text-[9px] text-white/20 tracking-widest uppercase">
          Desarrollado por{" "}
          <a 
            href="https://www.devwebpatagonia.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gold-sand transition-colors duration-300 font-bold"
          >
            devweb Patagonia
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;