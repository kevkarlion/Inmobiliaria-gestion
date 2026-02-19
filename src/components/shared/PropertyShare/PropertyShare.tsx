"use client"

import { useCallback, useMemo } from "react"
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

  // URL absoluta SSR-safe (usa tu BASE_URL)
  const url = useMemo(() => {
    const base =
      process.env.BASE_URL ||
      "https://riquelmeprop.com" // fallback producción
    return `${base}${pathname}`
  }, [pathname])

  const shareText = `${title} | ${price} | ${zone}`

  // Detecta soporte share sin estado ni efectos
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function"

  const handleNativeShare = useCallback(async () => {
    if (!canNativeShare) return

    try {
      await navigator.share({
        title,
        text: shareText,
        url,
      })
    } catch (error) {
      console.error("Native share error:", error)
    }
  }, [canNativeShare, title, shareText, url])

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
    } catch (error) {
      console.error("Copy link error:", error)
    }
  }, [url])

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Botón compartir nativo (móvil principalmente) */}
      <button
        onClick={handleNativeShare}
        disabled={!canNativeShare}
        className="w-full py-3 px-4 rounded-xl font-montserrat font-bold uppercase tracking-wide bg-gold-sand text-black hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Compartir propiedad
      </button>

      {/* Redes sociales */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={shareWhatsapp}
          className="w-full py-2.5 px-3 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:opacity-90 transition"
        >
          WhatsApp
        </button>

        <button
          onClick={shareFacebook}
          className="w-full py-2.5 px-3 rounded-lg bg-[#1877F2] text-white text-xs font-bold hover:opacity-90 transition"
        >
          Facebook
        </button>

        <button
          onClick={shareLinkedin}
          className="w-full py-2.5 px-3 rounded-lg bg-[#0A66C2] text-white text-xs font-bold hover:opacity-90 transition"
        >
          LinkedIn
        </button>

        <button
          onClick={copyLink}
          className="w-full py-2.5 px-3 rounded-lg bg-gold-sand text-black text-xs font-bold hover:opacity-90 transition"
        >
          Copiar link
        </button>
      </div>
    </div>
  )
}
