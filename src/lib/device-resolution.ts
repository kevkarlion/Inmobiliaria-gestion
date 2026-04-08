"use client";

import { useState, useEffect } from "react";

const BREAKPOINT = 768;

/**
 * Hook para detectar si el dispositivo es mobile (viewport < 768px)
 * Usa client-side detection para evitar hydration mismatch
 */
export function useDeviceResolution() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < BREAKPOINT);
    
    // Check inicial
    check();
    
    // Listener para cambios de viewport
    window.addEventListener("resize", check);
    
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

/**
 * Hook alternativo que retorna la resolución actual
 */
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    const check = () => setDeviceType(window.innerWidth < BREAKPOINT ? "mobile" : "desktop");
    
    check();
    window.addEventListener("resize", check);
    
    return () => window.removeEventListener("resize", check);
  }, []);

  return deviceType;
}

export { BREAKPOINT };
