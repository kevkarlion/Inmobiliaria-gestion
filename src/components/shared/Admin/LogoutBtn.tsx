"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

export const LogoutButton = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm("¿Estás seguro de que quieres cerrar sesión?")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        // Redirigimos al login y limpiamos el estado
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest disabled:opacity-50"
    >
      <LogOut size={18} />
      {loading ? "Saliendo..." : "Cerrar Sesión"}
    </button>
  );
};