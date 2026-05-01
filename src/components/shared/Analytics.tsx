"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = "G-YMX97YCPT7";

// ============================================================================
// Tipos para los eventos de analytics
// ============================================================================

interface EventParams {
  [key: string]: string | number | undefined;
}

interface PropertyViewParams {
  property_id: string;
  property_title: string;
  property_type: string;
  operation: "venta" | "alquiler";
  price?: number;
  currency?: string;
  location?: string;
}

interface CtaClickParams {
  cta_type: "whatsapp" | "telefono" | "mapa" | "email" | "contacto" | "detalles";
  cta_location: "card" | "detail" | "hero" | "footer";
  property_id?: string;
}

interface FormSubmitParams {
  form_type: "contacto" | "consulta" | "whatsapp" | "admin";
  property_id?: string;
  form_location: "card" | "detail" | "footer" | "header";
}

// ============================================================================
// Funciones de tracking - pueden ser usadas desde cualquier componente
// ============================================================================

/**
 * Función global para trackear eventos en GA4
 * Uso: trackEvent('event_name', { param: 'value' })
 */
export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

/**
 * Trackea visualización de propiedad (view_item equivalente para inmobiliarias)
 */
export function trackPropertyView(params: PropertyViewParams): void {
  trackEvent("view_property", {
    property_id: params.property_id,
    property_title: params.property_title,
    property_type: params.property_type,
    operation: params.operation,
    value: params.price,
    currency: params.currency || "ARS",
    location: params.location,
  });
}

/**
 * Trackea clicks en CTAs (whatsapp, teléfono, mapa, etc.)
 */
export function trackCtaClick(params: CtaClickParams): void {
  trackEvent("cta_click", {
    cta_type: params.cta_type,
    cta_location: params.cta_location,
    property_id: params.property_id || "",
  });
}

/**
 * Trackea envío de formularios
 */
export function trackFormSubmit(params: FormSubmitParams): void {
  trackEvent("form_submit", {
    form_type: params.form_type,
    form_location: params.form_location,
    property_id: params.property_id || "",
  });
}

/**
 * Trackea búsquedas de propiedades
 */
export function trackSearch(query: string, filters?: EventParams): void {
  trackEvent("property_search", {
    search_term: query,
    ...filters,
  });
}

/**
 * Trackea cuando un usuario hace click en WhatsApp
 * Este es un evento de CONVERSIÓN importante para inmobiliarias
 */
export function trackWhatsAppClick(propertyId?: string, propertyTitle?: string): void {
  trackEvent("whatsapp_click", {
    property_id: propertyId || "",
    property_title: propertyTitle || "",
  });
}

/**
 * Trackea llamadas telefónicas
 */
export function trackPhoneClick(propertyId?: string): void {
  trackEvent("phone_click", {
    property_id: propertyId || "",
  });
}

// ============================================================================
// Componente de tracking de pageviews
// ============================================================================

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? "?" + searchParams.toString() : "");

    if (window.gtag) {
      // Enhanced pageview con parámetros adicionales
      window.gtag("config", GA_ID, {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// ============================================================================
// Componente principal - provee contexto de analytics
// ============================================================================

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}