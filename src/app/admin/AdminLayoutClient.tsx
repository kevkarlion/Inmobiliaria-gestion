// app/admin/AdminLayoutClient.tsx
"use client";

import "@/app/globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import {
  Home,
  Users,
  Building2,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Toaster } from "sonner";
import { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const navItems = [
  { href: "/admin/properties", icon: Building2, label: "Propiedades" },
  { href: "/admin/clients", icon: Users, label: "Clientes" },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  return (
    <div className={`flex min-h-screen ${inter.variable} font-sans`}>
      {/* Sidebar */}
      <aside 
        className={`
          w-64 bg-slate-900 text-white flex flex-col fixed h-full z-50 
          transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin/properties" className="block" onClick={closeSidebar}>
            <h1 className="text-lg font-black uppercase tracking-tighter italic">
              Riquelme <span className="text-blue-400 font-normal">Prop</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Panel de Admin
            </p>
          </Link>
          {/* Botón cerrar en mobile */}
          <button 
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg"
            onClick={closeSidebar}
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeSidebar}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            onClick={closeSidebar}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Ver Sitio</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay para cerrar sidebar en mobile */}
      <div 
        className={`
          fixed inset-0 bg-black/50 z-40 lg:hidden
          ${sidebarOpen ? 'block' : 'hidden'}
        `}
        onClick={closeSidebar}
      />

      {/* Botón hamburguesa - solo visible en mobile */}
      <button 
        className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-slate-900 text-white rounded-lg shadow-lg"
        onClick={openSidebar}
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 w-full pt-14 lg:pt-0">
        {children}
      </main>
      <Toaster 
        position="bottom-right" 
        richColors 
        toastOptions={{
          style: {
            background: '#fff',
            border: '1px solid #e2e8f0',
          },
        }}
      />
    </div>
  );
}
