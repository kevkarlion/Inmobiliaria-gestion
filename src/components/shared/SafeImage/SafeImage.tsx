"use client";

import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  fallbackText?: string;
  /** Muestra un placeholder oscuro (para texto blanco encima) */
  darkPlaceholder?: boolean;
}

export function SafeImage({
  src,
  alt,
  fill,
  width = 800,
  height = 600,
  className = "",
  loading = "lazy",
  fallbackText,
  darkPlaceholder = false,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  // Placeholder classes - oscuro por defecto para texto blanco
  const placeholderClasses = darkPlaceholder
    ? "bg-neutral-800"
    : "bg-gradient-to-br from-primary/20 to-primary/5";

  // Si hay error o no hay src, mostrar placeholder
  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center ${placeholderClasses} ${className}`}
        style={{ position: "absolute", inset: 0 }}
      >
        {fallbackText && (
          <span className={`font-bold text-4xl ${darkPlaceholder ? "text-white/20" : "text-primary/30"}`}>
            {fallbackText.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  }

  // Usar etiqueta img nativa (no next/image) para que onError funcione en SSR
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setHasError(true)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
}
