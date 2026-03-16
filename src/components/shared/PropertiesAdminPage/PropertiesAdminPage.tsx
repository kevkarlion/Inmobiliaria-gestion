"use client";

import { useState } from "react";
import PropertyCardAdmin from "@/components/shared/PropertyCardAdmin/PropertyCardAdmin";
import CreatePropertyForm from "@/components/shared/PropertyForm/PropertyForm"; 
import EditPropertyForm from "@/components/shared/EditPropertyForm/EditPropertyForm";
import { PropertyResponse } from "@/dtos/property/property-response.dto";
import { Building2, Plus } from "lucide-react";

export default function PropertiesAdminClient({ initialProperties }: { initialProperties: PropertyResponse[] }) {
  const [properties, setProperties] = useState<PropertyResponse[]>(initialProperties);
  const [editingProperty, setEditingProperty] = useState<PropertyResponse | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);


  

  // Handlers de Lógica
  function handleCreate(newProperty: PropertyResponse) {
    setProperties((prev) => [newProperty, ...prev]);
    setShowCreateForm(false);
  }

  async function handleDelete(slug: string) {
    if (!confirm("¿Seguro quieres borrar esta propiedad?")) return;
    try {
      const res = await fetch(`/api/properties/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setProperties((p) => p.filter((x) => x.slug !== slug));
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }

  function handleUpdate(updatedProperty: PropertyResponse) {
    setProperties((prev) => prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p)));
    setShowEditForm(false);
    setEditingProperty(null);
  }

  return (
    <div className="p-4 pb-20 md:p-8 md:pb-8">
      <div className="max-w-7xl mx-auto">
        
        {/* SECCIÓN DE ACCIONES DE LISTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-[0.2em]">Inventario Actual</h2>
            <p className="text-slate-700 font-medium text-lg">{properties.length} Propiedades registradas</p>
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

        {/* GRID DE PROPIEDADES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {properties.length > 0 ? (
            properties.map((p) => (
              <div key={p.id} className="group transition-all duration-300 hover:-translate-y-2">
                <PropertyCardAdmin
                  property={p}
                  onDelete={handleDelete}
                  onEdit={(prop) => {
                    setEditingProperty(prop);
                    setShowEditForm(true);
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 text-center shadow-inner">
              <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-slate-900 font-black uppercase text-xl tracking-tighter">No hay nada por aquí</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                Comienza cargando tu primera propiedad al sistema
              </p>
              <button 
                 onClick={() => setShowCreateForm(true)}
                 className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase hover:bg-slate-800 transition-colors"
              >
                Crear Propiedad
              </button>
            </div>
          )}
        </div>

        {/* FOOTER SIMPLE */}
        <footer className="mt-20 pb-10 text-center">
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
             Admin System &copy; {new Date().getFullYear()} - Riquelme Propiedades
           </p>
        </footer>
      </div>
    </div>
  );
}