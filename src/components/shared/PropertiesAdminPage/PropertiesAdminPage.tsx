// app/admin/properties/PropertiesAdminClient.tsx
"use client";

import { useState } from "react";
import PropertyCardAdmin from "@/components/shared/PropertyCardAdmin/PropertyCardAdmin";
import PropertyForm from "@/components/shared/PropertyForm/PropertyForm";
import EditPropertyForm from "@/components/shared/EditPropertyForm/EditPropertyForm";
import { PropertyResponse } from "@/dtos/property/property-response.dto";

interface PropertiesAdminClientProps {
  initialProperties: PropertyResponse[];
}

export default function PropertiesAdminClient({
  initialProperties,
}: PropertiesAdminClientProps) {
  const [properties, setProperties] =
    useState<PropertyResponse[]>(initialProperties);

    console.log('properties base',properties)

  const [editingProperty, setEditingProperty] =
    useState<PropertyResponse | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showEditForm, setShowEditForm] = useState(false);

  async function handleDelete(slug: string) {
    if (!confirm("¿Seguro quieres borrar esta propiedad?")) return;
    await fetch(`/api/properties/${slug}`, { method: "DELETE" });
    setProperties((p) => p.filter((x) => x.slug !== slug));
  }

  function closeCreateForm() {
    setShowCreateForm(false);
  }

  function closeEditForm() {
    setShowEditForm(false);
    setEditingProperty(null);
  }

  function handleUpdate(updatedProperty: PropertyResponse) {
    setProperties((prev) =>
      prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p)),
    );
    closeEditForm();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Administrar Propiedades</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditingProperty(null);
            setShowCreateForm(true);
          }}
        >
          Crear nueva
        </button>
      </div>

      {showCreateForm && <PropertyForm onClose={closeCreateForm} />}

      {showEditForm && editingProperty && (
        <EditPropertyForm
          property={editingProperty}
          slug={editingProperty.slug}
          onClose={closeEditForm}
          onUpdate={handleUpdate} // <-- NUEVO
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((p) => (
          <PropertyCardAdmin
            key={p.id}
            property={p}
            onDelete={handleDelete}
            onEdit={() => {
              setEditingProperty(p);
              setShowEditForm(true);
            }}
          />
        ))}
      </div>
    </div>
  );
}
