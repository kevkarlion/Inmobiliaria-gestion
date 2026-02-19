"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

interface PropertyShareProps {
  title: string;
  price?: string;
  zone?: string;
}

export function PropertyShare({ title, price, zone }: PropertyShareProps) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    const base = process.env.BASE_URL || "";
    return `${base}${pathname}`;
  }, [pathname]);

  const shareMessage = useMemo(() => {
    const parts = [title];
    if (zone) parts.push(`📍 ${zone}`);
    if (price) parts.push(`💰 ${price}`);

    return `Mirá esta propiedad:\n${parts.join(" | ")}\n\n${url}`;
  }, [title, price, zone, url]);

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: shareMessage,
          url,
        });
      } else {
        shareWhatsapp();
      }
    } catch (error) {
      console.log("Share cancelado", error);
    }
  };

  const shareWhatsapp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      "_blank"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("No se pudo copiar el enlace", error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-2 relative">
      {/* Header premium */}
      <div className="flex items-center gap-3">
        <h4 className="label-subtitle text-white/80 uppercase tracking-widest">
          Compartir propiedad
        </h4>
        <div className="flex-1 h-px bg-white/20" />
      </div>

      {/* Botón principal */}
      <button
        onClick={handleNativeShare}
        className="w-full py-3 px-4 rounded-xl 
        font-montserrat font-bold uppercase tracking-wider
        bg-white text-oxford
        hover:bg-gold-sand hover:text-black
        transition-all duration-300 
        shadow-lg hover:shadow-xl
        active:scale-[0.99]"
      >
        Compartir propiedad
      </button>

      {/* Redes sociales */}
      <div className="grid grid-cols-2 gap-2 w-full">
        {/* WhatsApp */}
        <button
          onClick={shareWhatsapp}
          className="w-full py-2.5 px-3 rounded-lg
          bg-[#25D366] text-white
          text-xs font-bold tracking-wide
          hover:bg-[#1ebe5d]
          transition-all duration-200
          shadow-md hover:shadow-lg
          truncate"
        >
          WhatsApp
        </button>

        {/* Facebook */}
        <button
          onClick={shareFacebook}
          className="w-full py-2.5 px-3 rounded-lg
          bg-[#1877F2] text-white
          text-xs font-bold tracking-wide
          hover:bg-[#166fe5]
          transition-all duration-200
          shadow-md hover:shadow-lg
          truncate"
        >
          Facebook
        </button>

        {/* LinkedIn */}
        <button
          onClick={shareLinkedin}
          className="w-full py-2.5 px-3 rounded-lg
          bg-[#0A66C2] text-white
          text-xs font-bold tracking-wide
          hover:bg-[#095bb0]
          transition-all duration-200
          shadow-md hover:shadow-lg
          truncate"
        >
          LinkedIn
        </button>

        {/* Copiar link */}
        <button
          onClick={copyLink}
          className="w-full py-2.5 px-3 rounded-lg
          bg-gold-sand text-black
          text-xs font-black tracking-wide
          hover:bg-gold-hover
          transition-all duration-200
          shadow-md hover:shadow-lg
          truncate"
        >
          Copiar link
        </button>
      </div>

      {/* Toast sutil y moderno */}
      <div
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-3 
        px-4 py-2 rounded-lg text-sm font-medium
        backdrop-blur-md bg-white/10 border border-white/20 text-white
        shadow-xl transition-all duration-300
        ${
          copied
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2"
        }`}
      >
        🔗 Link copiado al portapapeles
      </div>
    </div>
  );
}
