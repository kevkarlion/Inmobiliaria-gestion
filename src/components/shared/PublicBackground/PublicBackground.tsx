"use client";

import { useEffect } from "react";

export function PublicBackground() {
  useEffect(() => {
    document.documentElement.style.backgroundColor = "#001d3d";
    return () => {
      document.documentElement.style.backgroundColor = "";
    };
  }, []);
  return null;
}
