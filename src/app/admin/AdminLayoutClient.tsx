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
  ChevronLeft,
  LogOut,
  Shield,
  FileText,
} from "lucide-react";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

// Base navigation items (visible to all)
const baseNavItems = [
  { href: "/admin/properties", icon: Building2, label: "Propiedades" },
  { href: "/admin/clients", icon: Users, label: "Clientes" },
];

// Admin-only navigation items
const adminNavItems = [
  { href: "/admin/users", icon: Shield, label: "Usuarios" },
  { href: "/admin/audit-logs", icon: FileText, label: "Auditoría" },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // Get user role and email from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      try {
        // Decode JWT to get role and email (simple base64 decode)
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
        setUserEmail(payload.email);
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }

    // Restore sidebar state from localStorage
    const savedState = localStorage.getItem("admin_sidebar_open");
    if (savedState !== null) {
      setSidebarOpen(savedState === "true");
    }
  }, []);

  const isAdmin = userRole === "admin";
  const navItems = isAdmin 
    ? [...baseNavItems, ...adminNavItems] 
    : baseNavItems;

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function toggleSidebar() {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    // Persist sidebar state
    localStorage.setItem("admin_sidebar_open", String(newState));
  }

  async function handleLogout() {
    try {
      localStorage.removeItem("admin_token");
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
          bg-slate-900 text-white flex flex-col fixed h-full z-50 
          transition-all duration-300 
          ${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}
        `}
      >
        {/* Logo */}
        <div className="p-3 lg:p-4 border-b border-slate-800 flex items-start justify-between">
          <div className={sidebarOpen ? 'block' : 'hidden lg:block'}>
            <Link href="/admin/properties" className="block">
              <h1 className="text-base font-black uppercase tracking-tighter italic">
                Riquelme <span className="text-blue-400 font-normal">Prop</span>
              </h1>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Panel de Admin
              </p>
            </Link>
            {/* Saludo al usuario */}
            {userEmail && (
              <p className="mt-2 text-xs text-slate-300">
                Hola, <span className="font-semibold text-blue-400">{userEmail.split('@')[0]}</span>!
              </p>
            )}
          </div>
          {/* Botón cerrar en mobile / toggle en desktop */}
          <button 
            className="p-2 hover:bg-slate-800 rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 p-3 lg:p-4 ${!sidebarOpen ? 'lg:p-2' : ''}`}>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm ${!sidebarOpen ? 'lg:justify-center lg:px-2' : ''}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className={`font-medium text-xs ${!sidebarOpen ? 'lg:hidden' : ''}`}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={`p-3 lg:p-4 border-t border-slate-800 space-y-1 ${!sidebarOpen ? 'lg:p-2 lg:space-y-1' : ''}`}>
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors text-sm ${!sidebarOpen ? 'lg:justify-center lg:px-2' : ''}`}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            <span className={`font-medium text-xs ${!sidebarOpen ? 'lg:hidden' : ''}`}>Ver Sitio</span>
          </Link>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-sm ${!sidebarOpen ? 'lg:justify-center lg:px-2' : ''}`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className={`font-medium text-xs ${!sidebarOpen ? 'lg:hidden' : ''}`}>Cerrar Sesión</span>
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

      {/* Botón flotante para mostrar/ocultar sidebar */}
      <button 
        className="fixed top-4 left-4 z-30 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Main Content - usa todo el ancho cuando sidebar está oculto */}
      <main className={`flex-1 w-full pt-14 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
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
