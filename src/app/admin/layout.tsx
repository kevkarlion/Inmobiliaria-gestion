// app/admin/layout.tsx
// Este layout es solo para /admin/login (página pública del admin)
// Las rutas protegidas están en /admin/(protected)/

import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // El login no necesita layout especial, solo renderiza el children
  // que es el formulario de login
  return children;
}
