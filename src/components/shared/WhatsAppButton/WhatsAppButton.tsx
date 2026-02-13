import React from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  // Reemplaza con tu número real (formato internacional sin el +)
  const phoneNumber = "5492984582082"; 
  const message = "Hola! Me gustaría obtener más información sobre una propiedad.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center 
                 w-14 h-14 md:w-16 md:h-16 
                 bg-[#25D366] text-white rounded-full shadow-2xl 
                 hover:scale-110 active:scale-95 transition-all duration-300
                 group"
      aria-label="Contactar por WhatsApp"
    >
      {/* Tooltip opcional que aparece en Desktop al pasar el mouse */}
      <span className="absolute right-full mr-3 bg-white text-onyx text-xs font-bold 
                       px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 
                       pointer-events-none transition-opacity duration-300 whitespace-nowrap hidden md:block">
        ¿Necesitás ayuda?
      </span>

      {/* Icono de Lucide */}
      <MessageCircle size={30} className="fill-current" />

      {/* Efecto de pulso suave para llamar la atención (opcional) */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-20 animate-ping" />
    </a>
  );
};

export default WhatsAppButton;