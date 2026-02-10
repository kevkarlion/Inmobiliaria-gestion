import Image from "next/image";

interface BackgroundLayerProps {
  src: string;
  grayscale?: boolean;          // Activa o desactiva blanco y negro
  overlayColor?: string;        // Color del overlay, ej: "black", "white", "#000000"
  overlayOpacity?: number;      // Opacidad del overlay (0 a 1)
}

export default function BackgroundLayer({
  src,
  grayscale = true,
  overlayColor = "black",
  overlayOpacity = 0.3,
}: BackgroundLayerProps) {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Imagen de fondo */}
      <Image
        src={src}
        alt="Background"
        fill
        className={`object-cover transition-all duration-500 ${grayscale ? "grayscale" : ""}`}
        priority
      />

      {/* Overlay personalizable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
        }}
      />
    </div>
  );
}
