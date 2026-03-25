"use client";

import { useEffect } from "react";

export function PublicBackground() {
  useEffect(() => {
    // No establecemos fondo azul por defecto - cada página define el suyo propio
    return () => {
      document.documentElement.style.backgroundColor = "";
    };
  }, []);
  return null;
}
