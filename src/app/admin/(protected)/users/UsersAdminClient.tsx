"use client";

import { useState } from "react";
import { UserResponse } from "@/dtos/user/user-response.dto";
import { toast } from "sonner";
import { Shield, ShieldOff, Plus, Search, X, Loader2, Calendar, MoreVertical, KeyRound } from "lucide-react";

interface Props {
  initialUsers: UserResponse[];
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function UsersAdminClient({ initialUsers }: Props) {
  const [users, setUsers] = useState<UserResponse[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resetPasswordModal, setResetPasswordModal] = useState<{ isOpen: boolean; userId: string; userEmail: string }>({
    isOpen: false,
    userId: "",
    userEmail: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user" as "admin" | "user",
  });

  // Filter users by search
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create user
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al crear usuario");
      }

      toast.success("Usuario creado exitosamente");
      setUsers([data, ...users]);
      setIsModalOpen(false);
      setFormData({ email: "", password: "", role: "user" });
    } catch (error: any) {
      toast.error(error.message || "Error al crear usuario");
    } finally {
      setIsLoading(false);
    }
  }

  // Deactivate user
  async function handleDeactivate(userId: string, userEmail: string) {
    if (!confirm(`¿Estás seguro de desactivar al usuario "${userEmail}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeader(),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al desactivar usuario");
      }

      toast.success("Usuario desactivado");
      setUsers(users.map((u) => (u.id === userId ? { ...u, active: false } : u)));
    } catch (error: any) {
      toast.error(error.message || "Error al desactivar usuario");
    }
  }

  // Activate user
  async function handleActivate(userId: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}/activate`, {
        method: "POST",
        headers: getAuthHeader(),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al activar usuario");
      }

      toast.success("Usuario activado");
      setUsers(users.map((u) => (u.id === userId ? { ...u, active: true } : u)));
    } catch (error: any) {
      toast.error(error.message || "Error al activar usuario");
    }
  }

  // Reset user password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsResettingPassword(true);
    try {
      const res = await fetch(`/api/admin/users/${resetPasswordModal.userId}/password`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include",
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al restablecer contraseña");
      }

      toast.success("Contraseña restablecida exitosamente");
      setResetPasswordModal({ isOpen: false, userId: "", userEmail: "" });
      setNewPassword("");
    } catch (error: any) {
      toast.error(error.message || "Error al restablecer contraseña");
    } finally {
      setIsResettingPassword(false);
    }
  }

  return (
    <div className="p-3 md:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white">Usuarios</h1>
          <p className="text-xs md:text-sm text-white hidden sm:block">Administra los usuarios del panel</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
        />
      </div>

      {/* Desktop Table - hidden on mobile */}
      <div className="hidden lg:block bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Email</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Rol</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Estado</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Creado</th>
              <th className="text-right px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-3 py-2.5">
                  <span className="text-sm font-medium text-slate-900">{user.email}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    {user.role === "admin" ? "Admin" : "Usuario"}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      user.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-sm text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setResetPasswordModal({ isOpen: true, userId: user.id, userEmail: user.email })}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Restablecer contraseña"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                    {user.active ? (
                      <button
                        onClick={() => handleDeactivate(user.id, user.email)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Desactivar"
                      >
                        <ShieldOff className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(user.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Activar"
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - visible only on mobile */}
      <div className="lg:hidden space-y-2">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg border border-slate-200 p-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-900 truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "Usuario"}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      user.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.active ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(user.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              
              {/* Expand button */}
              <button
                onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                className="p-1.5 hover:bg-slate-100 rounded-lg"
              >
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Expanded actions */}
            {expandedId === user.id && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => setResetPasswordModal({ isOpen: true, userId: user.id, userEmail: user.email })}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  Nueva Contraseña
                </button>
                {user.active ? (
                  <button
                    onClick={() => handleDeactivate(user.id, user.email)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <ShieldOff className="w-4 h-4" />
                    Desactivar
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(user.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Activar
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="p-6 text-center text-sm text-slate-500">
          No se encontraron usuarios
        </div>
      )}

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm md:max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-base md:text-lg font-semibold">Crear Usuario</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "user" })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-base md:text-lg font-semibold">Restablecer Contraseña</h2>
              <button
                onClick={() => setResetPasswordModal({ isOpen: false, userId: "", userEmail: "" })}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-4 space-y-3">
              <div>
                <p className="text-sm text-slate-600 mb-3">
                  Nueva contraseña para: <span className="font-medium">{resetPasswordModal.userEmail}</span>
                </p>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetPasswordModal({ isOpen: false, userId: "", userEmail: "" })}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isResettingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-xs text-slate-400">
        Admin &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
