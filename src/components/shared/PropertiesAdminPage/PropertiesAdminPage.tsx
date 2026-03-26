"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PropertyCardAdmin from "@/components/shared/PropertyCardAdmin/PropertyCardAdmin";
import CreatePropertyForm from "@/components/shared/PropertyForm/PropertyForm"; 
import EditPropertyForm from "@/components/shared/EditPropertyForm/EditPropertyForm";
import { PropertyResponse } from "@/dtos/property/property-response.dto";
import { Building2, Plus, MapPin, Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";

interface UserOption {
  id: string;
  email: string;
  label: string;
}

interface Props {
  initialProperties: PropertyResponse[];
  meta: { total: number; page: number; limit: number; pages: number };
  page: number;
  currentUser?: { id: string; isAdmin?: boolean } | null;
  filter?: string;
  users?: { id: string; email: string }[];
}

export default function PropertiesAdminClient({ 
  initialProperties, 
  meta, 
  page, 
  currentUser,
  filter = "all",
  users = []
}: Props) {
  const [properties, setProperties] = useState<PropertyResponse[]>(initialProperties);
  const [currentMeta, setCurrentMeta] = useState(meta);
  const [currentPage, setCurrentPage] = useState(page);
  const [editingProperty, setEditingProperty] = useState<PropertyResponse | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const router = useRouter();

  // Sync initial properties when filter changes (from server navigation)
  useEffect(() => {
    setProperties(initialProperties);
    setCurrentMeta(meta);
    setCurrentPage(page);
  }, [initialProperties, meta, page]);

  // Build dropdown options
  const dropdownOptions: UserOption[] = [
    { id: "all", email: "", label: "Todas" },
    { id: "mine", email: "", label: "Mis propiedades" },
    ...users.map(u => ({ ...u, label: u.email.split('@')[0] })),
  ];

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

  async function goToPage(newPage: number) {
    if (newPage < 1 || newPage > currentMeta.pages || newPage === currentPage) return;
    setLoading(true);
    setCurrentPage(newPage);
    try {
      const params = new URLSearchParams();
      params.set("page", String(newPage));
      if (filter !== "all") {
        params.set("filter", filter);
      }
      const res = await fetch(`/api/properties?${params.toString()}`);
      if (!res.ok) throw new Error("Error fetching page");
      const data = await res.json();
      setProperties(data.items);
      setCurrentMeta(data.meta);
      router.push(`/admin/properties?page=${newPage}`, { scroll: false });
    } catch {
      toast.error("Error al cargar la página");
    } finally {
      setLoading(false);
    }
  }


  

  // Handlers de Lógica
  async function handleCreate(newProperty: PropertyResponse) {
    setShowCreateForm(false);
    await refreshPage();
  }

  async function handleDelete(slug: string) {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Propiedad",
      message: "¿Seguro quieres borrar esta propiedad?",
      onConfirm: () => executeDelete(slug),
    });
  }

  async function executeDelete(slug: string) {
    setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
    try {
      const res = await fetch(`/api/properties/${slug}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Propiedad eliminada correctamente");
        await refreshPage();
      } else {
        toast.error("Error al eliminar la propiedad");
      }
    } catch {
      toast.error("Error al eliminar la propiedad");
    }
  }

  function handleUpdate(updatedProperty: PropertyResponse) {
    setShowEditForm(false);
    setEditingProperty(null);
    setProperties((prev) =>
      prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p)),
    );
  }

  async function refreshPage() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      if (filter !== "all") {
        params.set("filter", filter);
      }
      const res = await fetch(`/api/properties?${params.toString()}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProperties(data.items);
      setCurrentMeta(data.meta);
    } catch {
      // Si falla el refresh, simplemente recargamos la página
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(newFilter: string) {
    if (newFilter === filter) return;
    setFilterLoading(true);
    router.push(`/admin/properties?filter=${newFilter}&page=1`);
    // Reset loading after a short delay to allow navigation to complete
    setTimeout(() => setFilterLoading(false), 500);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="w-full">
        
        {/* SECCIÓN DE ACCIONES DE LISTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-[0.2em]">Inventario Actual</h2>
            <p className="text-slate-700 font-medium text-lg">
              {currentMeta.total} Propiedades registradas
              {currentMeta.pages > 1 && (
                <span className="text-slate-400 font-normal text-sm ml-2">
                  — página {currentPage} de {currentMeta.pages}
                </span>
              )}
            </p>
          </div>

          {/* Filter dropdown - available for all users */}
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              disabled={filterLoading}
              className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer min-w-[140px]"
            >
              {dropdownOptions.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl md:rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95 group w-full md:w-auto"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="uppercase text-xs tracking-widest">Publicar Nueva</span>
          </button>
        </div>

        {/* MODAL CREACIÓN */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300 overflow-x-hidden">
            <div
              className="w-full max-w-4xl max-h-[90vh] overflow-y-scroll overflow-x-hidden bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl"
              style={{ scrollbarGutter: "stable" }}
            >
              <CreatePropertyForm 
                onClose={() => setShowCreateForm(false)} 
                onCreate={handleCreate} 
              />
            </div>
          </div>
        )}

        {/* MODAL EDICIÓN */}
        {showEditForm && editingProperty && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300 overflow-x-hidden">
            <div
              className="w-full max-w-4xl max-h-[90vh] overflow-y-scroll overflow-x-hidden bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl"
              style={{ scrollbarGutter: "stable" }}
            >
              <EditPropertyForm 
                property={editingProperty} 
                slug={editingProperty.slug} 
                onClose={() => { setShowEditForm(false); setEditingProperty(null); }} 
                onUpdate={handleUpdate} 
              />
            </div>
          </div>
        )}

        {/* Spinner de carga */}
        {filterLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* VISTA DE TARJETAS (mobile + tablet) - solo cuando NO está cargando */}
        {!filterLoading && properties.length > 0 && (
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {properties.map((p) => (
              <PropertyCardAdmin
                key={p.id}
                property={p}
                onDelete={handleDelete}
                onEdit={(prop) => {
                  setEditingProperty(prop);
                  setShowEditForm(true);
                }}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}

        {/* TABLA DE PROPIEDADES (laptop en adelante) - solo cuando NO está cargando */}
        {!filterLoading && properties.length > 0 && (
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto max-h-[calc(100vh-200px)]">
              <table className="w-full text-sm min-w-[900px]">
                <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="text-center px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 w-14">Img</th>
                    <th className="text-left px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100">Tipo</th>
                    <th className="text-left px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100">Título</th>
                    <th className="text-left px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 hidden md:table-cell">Dirección</th>
                    <th className="text-right px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 hidden lg:table-cell">Precio</th>
                    <th className="text-center px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 hidden sm:table-cell">m²</th>
                    <th className="text-center px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 hidden sm:table-cell">Amb.</th>
                    <th className="text-center px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 hidden sm:table-cell">Hab</th>
                    <th className="text-center px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 hidden md:table-cell">Baños</th>
                    <th className="text-left px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 hidden lg:table-cell">Creado</th>
                    <th className="text-center px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((p, index) => (
                    <tr key={p.id} className={`transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50`}>
                      {/* Thumbnail */}
                      <td className="px-1 py-1.5">
                        {p.images?.[0]?.url ? (
                          <img
                            src={p.images[0].url}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover mx-auto border border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 mx-auto flex items-center justify-center">
                            <Building2 size={16} className="text-slate-300" />
                          </div>
                        )}
                      </td>

                      {/* Tipo */}
                      <td className="px-2 py-2">
                        <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-medium uppercase">
                          {p.propertyType?.name}
                        </span>
                      </td>
                      
                      {/* Título + Flags */}
                      <td className="px-2 py-2">
                        <div className="flex flex-wrap items-center gap-1 mb-1">
                          {p.flags?.featured && <span className="bg-amber-100 text-amber-700 text-[9px] px-1 py-0.5 rounded-full">Dest.</span>}
                          {p.flags?.opportunity && <span className="bg-rose-100 text-rose-700 text-[9px] px-1 py-0.5 rounded-full">Oport.</span>}
                          {p.flags?.premium && <span className="bg-purple-100 text-purple-700 text-[9px] px-1 py-0.5 rounded-full">Prem.</span>}
                        </div>
                        <Link href={`/properties/${p.slug}`} target="_blank" className="font-medium text-slate-800 hover:text-blue-600 hover:underline text-xs block w-[180px] lg:w-[220px]">
                          {p.title}
                        </Link>
                      </td>
                      
                      {/* Dirección */}
                      <td className="px-2 py-2 hidden md:table-cell">
                        <div className="text-slate-600 text-xs w-[120px] lg:w-[160px]">
                          <div className="flex items-start gap-1">
                            <MapPin size={11} className="text-slate-400 mt-0.5 flex-shrink-0" />
                            <span className="break-words">{p.address.street} {p.address.number}</span>
                          </div>
                          {p.address.city && <span className="text-[10px] text-slate-400 block mt-0.5">{p.address.city.name}</span>}
                        </div>
                      </td>
                      
                      {/* Precio */}
                      <td className="px-2 py-2 text-right hidden lg:table-cell">
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] text-slate-400">{p.price.currency}</span>
                          <span className="font-bold text-slate-800 text-[10px]">
                            {p.price.amount.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </td>
                      
                      {/* m² */}
                      <td className="px-1 py-2 text-center hidden sm:table-cell">
                        <div className="flex flex-col items-center text-[10px] text-slate-600">
                          {p.features.totalM2 && <span>{p.features.totalM2}m²</span>}
                          {p.features.coveredM2 && p.features.coveredM2 !== p.features.totalM2 && (
                            <span className="text-slate-400 text-[9px]">{p.features.coveredM2}cub</span>
                          )}
                        </div>
                      </td>
                      
                      {/* Ambientes */}
                      <td className="px-1 py-2 text-center hidden sm:table-cell">
                        <span className="text-[10px] text-slate-600">{p.features.rooms || '-'}</span>
                      </td>
                      
                      {/* Habitaciones */}
                      <td className="px-1 py-2 text-center hidden sm:table-cell">
                        <span className="text-[10px] text-slate-600">{p.features.bedrooms}</span>
                      </td>
                      
                      {/* Baños */}
                      <td className="px-1 py-2 text-center hidden md:table-cell">
                        <span className="text-[10px] text-slate-600">{p.features.bathrooms}</span>
                      </td>
                      
                      {/* Creado por */}
                      <td className="px-2 py-2 hidden lg:table-cell">
                        <span className="text-[10px] text-slate-500">{p.createdBy?.email?.split('@')[0] || '-'}</span>
                      </td>
                      
                      {/* Acciones */}
                      <td className="px-1 py-2">
                        <div className="flex items-center justify-center gap-1">
                          {/* Mostrar botones solo si es admin o propietario */}
                          {(currentUser?.isAdmin || p.createdBy?.userId === currentUser?.id) && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingProperty(p);
                                  setShowEditForm(true);
                                }}
                                className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => handleDelete(p.slug)}
                                className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ESTADO VACÍO */}
        {!filterLoading && properties.length === 0 && (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl py-16 text-center">
            <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-slate-900 font-bold text-lg">No hay propiedades</h3>
            <p className="text-slate-400 text-sm mt-1">Comienza cargando tu primera propiedad</p>
            <button 
               onClick={() => setShowCreateForm(true)}
               className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase hover:bg-slate-800 transition-colors"
            >
              Crear Propiedad
            </button>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {!filterLoading && currentMeta.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1 || loading || filterLoading}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: currentMeta.pages }, (_, i) => i + 1).map((p) => {
                const show =
                  p === 1 ||
                  p === currentMeta.pages ||
                  Math.abs(p - currentPage) <= 1;
                const ellipsisBefore = p === 2 && currentPage > 4;
                const ellipsisAfter =
                  p === currentMeta.pages - 1 &&
                  currentPage < currentMeta.pages - 3;

                if (!show && !ellipsisBefore && !ellipsisAfter) return null;

                if (ellipsisBefore || ellipsisAfter) {
                  return (
                    <span key={`ellipsis-${p}`} className="px-2 text-slate-400">
                      …
                    </span>
                  );
                }

                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    disabled={loading || filterLoading}
                    className={`min-w-[36px] h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                      p === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= currentMeta.pages || loading || filterLoading}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* FOOTER SIMPLE */}
        <footer className="mt-8 pb-6 text-center">
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