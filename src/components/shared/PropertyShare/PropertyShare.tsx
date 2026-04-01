"use client"

import { useCallback, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

interface PropertyShareProps {
  title: string
  price: string
  zone: string
}

export default function PropertyShare({
  title,
  price,
  zone,
}: PropertyShareProps) {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  // URL absoluta SSR-safe
  const url = useMemo(() => {
    const base =
      process.env.BASE_URL ||
      "https://riquelmeprop.com"
    return `${base}${pathname}`
  }, [pathname])

  const shareText = `${title} | ${price} | ${zone}`

  const handleNativeShare = useCallback(async () => {
    // Verificar en el momento del click (evita hydration mismatch)
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        })
      } catch (error) {
        console.error("Native share error:", error)
      }
    }
  }, [title, shareText, url])

  const shareWhatsapp = useCallback(() => {
    const wa = `https://wa.me/?text=${encodeURIComponent(
      `${shareText} ${url}`
    )}`
    window.open(wa, "_blank", "noopener,noreferrer")
  }, [shareText, url])

  const shareFacebook = useCallback(() => {
    const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`
    window.open(fb, "_blank", "noopener,noreferrer")
  }, [url])

  const shareLinkedin = useCallback(() => {
    const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`
    window.open(li, "_blank", "noopener,noreferrer")
  }, [url])

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)

      // Activamos toast (SIN useEffect, así evitamos loops)
      setCopied(true)

      // Se oculta solo después de 2 segundos
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error("Copy link error:", error)
    }
  }, [url])

  return (
    <div className="w-full flex flex-col gap-4 relative">
      {/* Botón compartir nativo */}
      <button
        onClick={handleNativeShare}
        className="w-full py-3 px-4 rounded-xl font-inter font-semibold uppercase tracking-wide bg-gold-sand text-black hover:opacity-90 transition"
      >
        Compartir propiedad
      </button>

      {/* Redes sociales */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={shareWhatsapp}
          className="w-full py-2.5 px-3 rounded-lg bg-[#25D366] text-white text-xs font-inter font-semibold hover:opacity-90 transition"
        >
          WhatsApp
        </button>

        <button
          onClick={shareFacebook}
          className="w-full py-2.5 px-3 rounded-lg bg-[#1877F2] text-white text-xs font-inter font-semibold hover:opacity-90 transition"
        >
          Facebook
        </button>

        <button
          onClick={shareLinkedin}
          className="w-full py-2.5 px-3 rounded-lg bg-[#0A66C2] text-white text-xs font-inter font-semibold hover:opacity-90 transition"
        >
          LinkedIn
        </button>

        <button
          onClick={copyLink}
          className="w-full py-2.5 px-3 rounded-lg bg-gold-sand text-black text-xs font-inter font-semibold hover:opacity-90 transition"
        >
          Copiar link
        </button>
      </div>

      {/* Toast moderno y sutil */}
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
        🔗 Enlace copiado
      </div>
    </div>
  )
}
