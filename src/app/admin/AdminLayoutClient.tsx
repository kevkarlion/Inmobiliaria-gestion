// app/admin/AdminLayoutClient.tsx
"use client";

import "@/app/globals.css";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  Newspaper,
} from "lucide-react";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

// Viewport detection hook
function useViewport() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return { isMobile, isTablet };
}

// Base navigation items (visible to all)
const baseNavItems = [
  { href: "/admin/properties", icon: Building2, label: "Propiedades" },
  { href: "/admin/clients", icon: Users, label: "Clientes" },
  { href: "/admin/novedades", icon: Newspaper, label: "Novedades" },
];

// Admin-only navigation items
const adminNavItems = [
  { href: "/admin/users", icon: Shield, label: "Usuarios" },
  { href: "/admin/audit-logs", icon: FileText, label: "Auditoría" },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile, isTablet } = useViewport();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  const isDesktop = !isMobile && !isTablet;

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
  }, []);

  // Initialize sidebar state based on viewport
  // Desktop: use localStorage, default to open (for new sessions)
  // Mobile/tablet: use localStorage with default open
  useEffect(() => {
    const savedState = localStorage.getItem("admin_sidebar_open");
    if (savedState !== null) {
      setSidebarOpen(savedState === "true");
    } else {
      // Default to open for all viewports (including desktop)
      setSidebarOpen(true);
    }
  }, []);

  const isAdmin = userRole === "admin";
  const navItems = isAdmin
    ? [...baseNavItems, ...adminNavItems]
    : baseNavItems;

  // Check if nav item is active
  function isActiveNavItem(href: string): boolean {
    return pathname.startsWith(href);
  }

  // Handle nav click with auto-close on mobile/tablet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleNavClick(_e: React.MouseEvent<HTMLAnchorElement>, _href: string) {
    if (!isDesktop) {
      // Allow navigation to start, then close sidebar after delay
      setTimeout(() => {
        setSidebarOpen(false);
        localStorage.setItem("admin_sidebar_open", "false");
      }, 120);
    }
  }

  function closeSidebar() {
    setSidebarOpen(false);
    localStorage.setItem("admin_sidebar_open", "false");
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

  // Font size class based on viewport
  const navTextClass = isMobile ? "text-sm" : "text-xs";

  return (
    <div className={`flex min-h-screen ${inter.variable} font-sans`}>
      {/* Sidebar */}
      <aside
        className={`
          bg-slate-900 text-white flex flex-col fixed h-full z-50 
          transition-all duration-300 
          ${sidebarOpen
            ? 'w-64 translate-x-0'
            : 'w-64 -translate-x-full'
          }
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
          {/* Botón cerrar/abrir sidebar */}
          <button
            className="p-2 hover:bg-slate-800 rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation with active highlighting */}
        <nav className={`flex-1 p-3 lg:p-4 ${!sidebarOpen ? 'lg:p-2' : ''}`}>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg 
                    transition-colors ${navTextClass}
                    ${isActiveNavItem(item.href)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                    ${!sidebarOpen ? 'lg:justify-center lg:px-2' : ''}
                  `}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className={`font-medium ${!sidebarOpen ? 'lg:hidden' : ''}`}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={`p-3 lg:p-4 border-t border-slate-800 space-y-1 ${!sidebarOpen ? 'lg:p-2 lg:space-y-1' : ''}`}>
          <Link
            href="/"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg 
              text-slate-500 hover:bg-slate-800 hover:text-white 
              transition-colors ${navTextClass} 
              ${!sidebarOpen ? 'lg:justify-center lg:px-2' : ''}
            `}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            <span className={`font-medium ${!sidebarOpen ? 'lg:hidden' : ''}`}>Ver Sitio</span>
          </Link>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg 
              text-red-500 hover:bg-red-500/10 hover:text-red-400 
              transition-colors w-full ${navTextClass} 
              ${!sidebarOpen ? 'lg:justify-center lg:px-2' : ''}
            `}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className={`font-medium ${!sidebarOpen ? 'lg:hidden' : ''}`}>Cerrar Sesión</span>
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

      {/* Botón flotante para mostrar sidebar cuando está cerrado */}
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-30 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
          onClick={toggleSidebar}
          aria-label="Mostrar menú"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Main Content - usa todo el ancho cuando sidebar está oculto */}
      <main className={`flex-1 w-full pt-14 bg-white ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
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
