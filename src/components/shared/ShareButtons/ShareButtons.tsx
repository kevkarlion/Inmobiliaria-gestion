"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Share2, Facebook, MessageCircle, Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("¡Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el link");
    }
  }

  async function shareNative() {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `${title} - ${url}`,
          url,
        });
      } else {
        // Fallback: copiar link
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("¡Link copiado!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled or error - silently ignore
    }
  }

  function shareOnFacebook() {
    // Abrir Facebook en nueva pestaña con los parámetros corretos
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2">
      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider w-full sm:w-auto sm:mr-1">
        Compartir
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shrink-0"
        aria-label="Compartir en WhatsApp"
      >
        <MessageCircle size={16} />
      </a>

      <button
        type="button"
        onClick={shareOnFacebook}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shrink-0"
        aria-label="Compartir en Facebook"
      >
        <Facebook size={16} />
      </button>

      <button
        type="button"
        onClick={shareNative}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-600 text-white hover:bg-neutral-700 transition-colors shrink-0"
        aria-label="Compartir"
        title="Más opciones"
      >
        <Share2 size={16} />
      </button>

      <button
        type="button"
        onClick={copyLink}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-primary hover:text-primary transition-colors shrink-0"
        aria-label="Copiar link"
      >
        {copied ? <Check size={15} className="text-green-600" /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
