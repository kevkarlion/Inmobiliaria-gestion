"use client";

import { useState } from "react";
import PropertyCardAdmin from "@/components/shared/PropertyCardAdmin/PropertyCardAdmin";
import CreatePropertyForm from "@/components/shared/PropertyForm/PropertyForm"; 
import EditPropertyForm from "@/components/shared/EditPropertyForm/EditPropertyForm";
import { PropertyResponse } from "@/dtos/property/property-response.dto";

export default function PropertiesAdminClient({ initialProperties }: { initialProperties: PropertyResponse[] }) {
  const [properties, setProperties] = useState<PropertyResponse[]>(initialProperties);
  const [editingProperty, setEditingProperty] = useState<PropertyResponse | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  function handleCreate(newProperty: PropertyResponse) {
    // Insertamos al inicio del array para ver el cambio arriba
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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Panel de Propiedades</h1>
            <p className="text-slate-500 text-sm">Gestiona el inventario en tiempo real.</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>+</span> Crear Propiedad
          </button>
        </header>

        {/* MODAL CREACIÓN */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <CreatePropertyForm 
              onClose={() => setShowCreateForm(false)} 
              onCreate={handleCreate} 
            />
          </div>
        )}

        {/* MODAL EDICIÓN */}
        {showEditForm && editingProperty && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <EditPropertyForm 
              property={editingProperty} 
              slug={editingProperty.slug} 
              onClose={() => { setShowEditForm(false); setEditingProperty(null); }} 
              onUpdate={handleUpdate} 
            />
          </div>
        )}

        {/* GRID DE PROPIEDADES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length > 0 ? (
            properties.map((p) => (
              <PropertyCardAdmin
                key={p.id}
                property={p}
                onDelete={handleDelete}
                onEdit={(prop) => {
                  setEditingProperty(prop);
                  setShowEditForm(true);
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-400 font-medium">
              No hay propiedades cargadas todavía.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}