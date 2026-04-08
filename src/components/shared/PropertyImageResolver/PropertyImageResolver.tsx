"use client";

import Image from "next/image";
import { useDeviceResolution } from "@/lib/device-resolution";

interface PropertyImageResolverProps {
  images?: string[];
  imagesDesktop?: string[];
  imagesMobile?: string[];
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Componente que resuelve la imagen correcta según el dispositivo.
 * Si el array específico está vacío, usa el array images como fallback.
 */
export function PropertyImageResolver({
  images = [],
  imagesDesktop = [],
  imagesMobile = [],
  alt,
  fill = true,
  sizes,
  className,
  priority = false,
}: PropertyImageResolverProps) {
  const isMobile = useDeviceResolution();

  // Seleccionar el array correcto según el dispositivo
  const selectedImages = isMobile
    ? imagesMobile.length > 0
      ? imagesMobile
      : images
    : imagesDesktop.length > 0
      ? imagesDesktop
      : images;

  const imageUrl = selectedImages[0] || "/placeholder.jpg";

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
