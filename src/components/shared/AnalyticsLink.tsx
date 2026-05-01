"use client";

import { trackCtaClick } from "@/components/shared/Analytics";

interface Props {
  href: string;
  children: React.ReactNode;
  cta_type: "whatsapp" | "telefono" | "mapa" | "email" | "contacto" | "detalles";
  cta_location: "card" | "detail" | "hero" | "footer" | "header";
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

export function AnalyticsLink({
  href,
  children,
  cta_type,
  cta_location,
  className,
  target,
  rel,
  "aria-label": ariaLabel,
}: Props) {
  const handleClick = () => {
    trackCtaClick({ cta_type, cta_location });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}