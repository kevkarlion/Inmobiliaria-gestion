"use client";

import { useState } from "react";
import PropertyCardAdmin from "@/components/shared/PropertyCardAdmin/PropertyCardAdmin";
import CreatePropertyForm from "@/components/shared/PropertyForm/PropertyForm"; 
import EditPropertyForm from "@/components/shared/EditPropertyForm/EditPropertyForm";
import { PropertyResponse } from "@/dtos/property/property-response.dto";
import { LogoutButton } from "@/components/shared/Admin/LogoutBtn";
import { Building2, Plus, Home } from "lucide-react";

export default function PropertiesAdminClient({ initialProperties }: { initialProperties: PropertyResponse[] }) {
  const [properties, setProperties] = useState<PropertyResponse[]>(initialProperties);
  const [editingProperty, setEditingProperty] = useState<PropertyResponse | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);


  console.log('initialProperties',initialProperties)

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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DEL PANEL - Enfoque en Usuario y Status */}
        <header className="flex flex-row items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-3 rounded-xl shadow-lg">
              <Home className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                Riquelme <span className="text-blue-600 font-normal">Propiedades</span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Admin Online</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LogoutButton />
          </div>
        </header>

        {/* SECCIÓN DE ACCIONES DE LISTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-2">
          <div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Inventario Actual</h2>
            <p className="text-slate-900 font-bold text-lg">{properties.length} Propiedades registradas</p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all active:scale-95 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="uppercase text-xs tracking-widest">Publicar Nueva Propiedad</span>
          </button>
        </div>

        {/* MODAL CREACIÓN */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl">
              <CreatePropertyForm 
                onClose={() => setShowCreateForm(false)} 
                onCreate={handleCreate} 
              />
            </div>
          </div>
        )}

        {/* MODAL EDICIÓN */}
        {showEditForm && editingProperty && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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