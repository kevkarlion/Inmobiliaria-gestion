// app/admin/(protected)/layout.tsx
import "@/app/globals.css";
import type { Metadata } from "next";
import AdminLayoutClient from "../AdminLayoutClient";

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

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
