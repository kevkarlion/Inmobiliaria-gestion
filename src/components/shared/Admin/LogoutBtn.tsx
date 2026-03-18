"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export const LogoutButton = () => {
  const [loading, setLoading] = useState(false);

  // Confirm modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleLogout = async () => {
    setConfirmModalOpen(true);
  };

  const onConfirm = async () => {
    setConfirmModalOpen(false);
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

  const onCancel = () => {
    setConfirmModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest disabled:opacity-50"
      >
        <LogOut size={18} />
        {loading ? "Saliendo..." : "Cerrar Sesión"}
      </button>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        onConfirm={onConfirm}
        onCancel={onCancel}
        confirmLabel="Cerrar sesión"
        cancelLabel="Cancelar"
      />
    </>
  );
};
