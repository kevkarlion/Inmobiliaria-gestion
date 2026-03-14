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

interface Props {
  initialClients: ClientResponse[];
}

export default function ClientsAdminClient({ initialClients }: Props) {
  const [clients, setClients] = useState<ClientResponse[]>(initialClients);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<ClientSource | "all">("all");

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
    if (!confirm("¿Seguro quieres eliminar este cliente?")) return;
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClients((c) => c.filter((x) => x.id !== id));
        toast.success("Cliente eliminado", {
          description: "El cliente ha sido eliminado correctamente.",
        });
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Error al eliminar cliente", {
        description: "Hubo un problema al intentar eliminar el cliente.",
      });
    }
  }

  return (
    <div className="p-4 pb-20 md:p-8 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* SECCIÓN DE ACCIONES */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-[0.2em]">Gestión de Clientes</h2>
            <p className="text-slate-700 font-medium text-lg">
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
        <div className="mb-6 space-y-4">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
            <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 text-center shadow-inner">
              <Users className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-slate-900 font-black uppercase text-xl tracking-tighter">No hay clientes</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                {searchTerm || statusFilter !== "all" || sourceFilter !== "all"
                  ? "No hay clientes que coincidan con los filtros"
                  : "Comienza cargando tu primer cliente"}
              </p>
              {!searchTerm && statusFilter === "all" && sourceFilter === "all" && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase hover:bg-slate-800 transition-colors"
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
      </div>
    </div>
  );
}
