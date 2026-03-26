"use client";

import { useState } from "react";
import ClientCardAdmin from "@/components/shared/ClientCardAdmin/ClientCardAdmin";
import ClientForm from "@/components/shared/ClientForm/ClientForm";
import ClientNewModal from "@/app/admin/(protected)/clients/components/ClientNewModal";
import ClientFilters from "@/components/shared/ClientFilters/ClientFilters";
import { ClientResponse } from "@/dtos/client/client-response.dto";
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { ClientSource } from "@/domain/enums/client-source.enum";
import { Users, Plus, UserPlus, Search } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface Props {
  initialClients: ClientResponse[];
}

export default function ClientsAdminClient({ initialClients }: Props) {
  const [clients, setClients] = useState<ClientResponse[]>(initialClients);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<ClientSource | "all">("all");

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Filtrar clientes
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      searchTerm === "" ||
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    const matchesSource = sourceFilter === "all" || client.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Handlers
  async function handleCreate(newClient: ClientResponse) {
    setClients((prev) => [newClient, ...prev]);
    setShowCreateForm(false);
    toast.success("Cliente creado correctamente", {
      description: `${newClient.name} ha sido agregado a tu lista de clientes.`,
    });
  }

  async function handleUpdate(updatedClient: ClientResponse) {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
  }

  async function handleDelete(id: string) {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Cliente",
      message: "¿Seguro quieres eliminar este cliente?",
      onConfirm: () => executeDelete(id),
    });
  }

  async function executeDelete(id: string) {
    setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { 
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setClients((c) => c.filter((x) => x.id !== id));
        toast.success("Cliente eliminado", {
          description: "El cliente ha sido eliminado correctamente.",
        });
      } else {
        toast.error("Error al eliminar cliente");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Error al eliminar cliente", {
        description: "Hubo un problema al intentar eliminar el cliente.",
      });
    }
  }

  return (
    <div className="p-3 pb-10 md:p-5 md:pb-5">
      <div className="max-w-7xl mx-auto">
        {/* SECCIÓN DE ACCIONES */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 px-1">
          <div>
            <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em]">Gestión de Clientes</h2>
            <p className="text-slate-700 font-medium text-xs">
              {filteredClients.length} {filteredClients.length === 1 ? "cliente" : "clientes"} registrados
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl md:rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95 group w-full md:w-auto"
          >
            <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="uppercase text-xs tracking-widest">Nuevo Cliente</span>
          </button>
        </div>

        {/* FILTROS Y BÚSQUEDA */}
        <div className="mb-4 space-y-3">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Filtros */}
          <ClientFilters
            statusFilter={statusFilter}
            sourceFilter={sourceFilter}
            onStatusChange={setStatusFilter}
            onSourceChange={setSourceFilter}
          />
        </div>

        {/* MODAL CREACIÓN */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl">
              <ClientNewModal onClose={() => setShowCreateForm(false)} onCreate={handleCreate} />
            </div>
          </div>
        )}

        {/* GRID DE CLIENTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <ClientCardAdmin
                key={client.id}
                client={client}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-2xl py-16 text-center shadow-inner">
              <Users className="w-10 h-10 text-slate-200 mx-auto mb-4" />
              <h3 className="text-slate-900 font-semibold uppercase text-sm tracking-tight">No hay clientes</h3>
              <p className="text-slate-400 font-medium uppercase tracking-widest text-[10px] mt-2">
                {searchTerm || statusFilter !== "all" || sourceFilter !== "all"
                  ? "No hay clientes que coincidan con los filtros"
                  : "Comienza cargando tu primer cliente"}
              </p>
              {!searchTerm && statusFilter === "all" && sourceFilter === "all" && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-lg font-medium text-xs uppercase hover:bg-slate-800 transition-colors"
                >
                  Crear Cliente
                </button>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="mt-20 pb-10 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            Admin System &copy; {new Date().getFullYear()} - Riquelme Propiedades
          </p>
        </footer>

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel="Eliminar"
          onConfirm={() => confirmModal.onConfirm?.()}
          onCancel={() => setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null })}
        />
      </div>
    </div>
  );
}
