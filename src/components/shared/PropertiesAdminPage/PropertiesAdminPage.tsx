/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import PropertyCardAdmin from "@/components/shared/PropertyCardAdmin/PropertyCardAdmin";
import PropertyForm from "@/components/shared/PropertyForm/PropertyForm";
import EditPropertyForm from "@/components/shared/EditPropertyForm/EditPropertyForm";

export default function PropertiesAdminPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // 🚀 Cargar propiedades
  async function fetchProperties() {
    setLoading(true);
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProperties(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  // 🗑 Eliminar propiedad
  async function handleDelete(slug: string) {
    if (!confirm("¿Seguro quieres borrar esta propiedad?")) return;
    try {
      await fetch(`/api/properties/${slug}`, { method: "DELETE" });
      fetchProperties(); // recargar listado
    } catch (err) {
      console.error(err);
    }
  }

  // ✏️ Editar propiedad
  function handleEdit(property: any) {
    setEditingProperty(property);
    setShowEditForm(true);
  }

  // ✨ Cerrar formularios
  function closeCreateForm() {
    setShowCreateForm(false);
    fetchProperties();
  }

  function closeEditForm() {
    setShowEditForm(false);
    setEditingProperty(null);
    fetchProperties();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Administrar Propiedades</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => { setEditingProperty(null); setShowCreateForm(true); }}
        >
          Crear nueva
        </button>
      </div>

      {/* Formulario de creación */}
      {showCreateForm && (
        <PropertyForm
          
          onClose={closeCreateForm}
        />
      )}

      {/* Formulario de edición */}
      {showEditForm && editingProperty && (
        <EditPropertyForm
          property={editingProperty}
           slug={editingProperty?.slug} // 👈 PASAR EL SLUG AQUÍ
          onClose={closeEditForm}
        />
      )}

      {loading ? (
        <p>Cargando propiedades...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <PropertyCardAdmin
              key={p.id}
              property={p}
              onDelete={handleDelete}
              onEdit={() => handleEdit(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
