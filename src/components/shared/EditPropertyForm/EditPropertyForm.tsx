"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import { PropertyResponseDTO } from "@/dtos/property/property-response.dto";
import { UpdatePropertyDTO } from "@/dtos/property/update-property.dto";
import { mapPropertyToForm } from "@/domain/mappers/propertyToForm.mapper";

interface EditPropertyFormProps {
  property: PropertyResponseDTO;
  slug: string;
  onClose: () => void;
}

export default function EditPropertyForm({ property, slug, onClose }: EditPropertyFormProps) {
  const [form, setForm] = useState<UpdatePropertyDTO>(() => mapPropertyToForm(property));

  useEffect(() => {
    setForm(mapPropertyToForm(property));
  }, [property]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, key] = name.split(".");
      const parentValue = form[parent as keyof UpdatePropertyDTO];

      const parentObj =
        parentValue && typeof parentValue === "object" && !Array.isArray(parentValue)
          ? parentValue
          : {};

      if (type === "checkbox") {
        const target = e.target as HTMLInputElement;
        setForm({ ...form, [parent]: { ...parentObj, [key]: target.checked } } as UpdatePropertyDTO);
      } else if (type === "number") {
        setForm({ ...form, [parent]: { ...parentObj, [key]: Number(value) } } as UpdatePropertyDTO);
      } else {
        setForm({ ...form, [parent]: { ...parentObj, [key]: value } } as UpdatePropertyDTO);
      }
    } else {
      if (type === "checkbox") {
        const target = e.target as HTMLInputElement;
        setForm({ ...form, [name]: target.checked } as UpdatePropertyDTO);
      } else if (type === "number") {
        setForm({ ...form, [name]: Number(value) } as UpdatePropertyDTO);
      } else {
        setForm({ ...form, [name]: value } as UpdatePropertyDTO);
      }
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/properties/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error actualizando propiedad");
      alert("Propiedad actualizada con éxito!");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar la propiedad");
    }
  }

  // Tags dinámicos
  const addTag = () => setForm({ ...form, tags: [...(form.tags ?? []), ""] });
  const updateTag = (index: number, value: string) => {
    const newTags = [...(form.tags ?? [])];
    newTags[index] = value;
    setForm({ ...form, tags: newTags });
  };
  const removeTag = (index: number) => {
    const newTags = [...(form.tags ?? [])];
    newTags.splice(index, 1);
    setForm({ ...form, tags: newTags });
  };

  // Imágenes dinámicas
  const addImage = (url: string) => setForm({ ...form, images: [...(form.images ?? []), url] });
  const removeImage = (index: number) => {
    const newImages = [...(form.images ?? [])];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    // Demo: convertir a base64, reemplazar con upload a servidor si querés
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") addImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-neutral-900 text-white rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Editar Propiedad</h1>
        <button type="button" onClick={onClose} className="text-red-500 hover:text-red-700 font-semibold">✕ Cerrar</button>
      </div>

      {/* Título */}
      <div>
        <label className="block font-semibold">Título</label>
        <input
          type="text"
          name="title"
          value={form.title || ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      </div>

      {/* Operación */}
      <div>
        <label className="block font-semibold">Operación</label>
        <select
          name="operationType"
          value={form.operationType || ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
      </div>

      {/* Tipo de propiedad */}
      <div>
        <label className="block font-semibold">Tipo de Propiedad</label>
        <select
          name="propertyTypeSlug"
          value={form.propertyTypeSlug || ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="">Seleccione</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
        </select>
      </div>

      {/* Zona */}
      <div>
        <label className="block font-semibold">Zona</label>
        <select
          name="zoneSlug"
          value={form.zoneSlug || ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="">Seleccione</option>
          <option value="centro">Centro</option>
          <option value="norte">Norte</option>
          <option value="sur">Sur</option>
        </select>
      </div>

      {/* Dirección */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block font-semibold">Calle</label>
          <input
            type="text"
            name="address.street"
            value={form.address?.street || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">Número</label>
          <input
            type="text"
            name="address.number"
            value={form.address?.number || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">CP</label>
          <input
            type="text"
            name="address.zipCode"
            value={form.address?.zipCode || ""}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
      </div>

      {/* Precio */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block font-semibold">Precio</label>
          <input
            type="number"
            name="price.amount"
            value={form.price?.amount ?? 0}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">Moneda</label>
          <select
            name="price.currency"
            value={form.price?.currency || "USD"}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="USD">USD</option>
            <option value="ARS">ARS</option>
          </select>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-4 gap-2">
        <div>
          <label className="block font-semibold">Dormitorios</label>
          <input
            type="number"
            name="features.bedrooms"
            value={form.features?.bedrooms ?? 0}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">Baños</label>
          <input
            type="number"
            name="features.bathrooms"
            value={form.features?.bathrooms ?? 0}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">Total m²</label>
          <input
            type="number"
            name="features.totalM2"
            value={form.features?.totalM2 ?? 0}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">Cubiertos m²</label>
          <input
            type="number"
            name="features.coveredM2"
            value={form.features?.coveredM2 ?? 0}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>
          <label className="block font-semibold">Ambientes</label>
          <input
            type="number"
            name="features.rooms"
            value={form.features?.rooms ?? 0}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="features.garage"
            checked={form.features?.garage ?? false}
            onChange={handleChange}
            className="h-5 w-5"
          />
          <label className="font-semibold">Garage</label>
        </div>
      </div>

      {/* Flags */}
      <div className="flex gap-4 mt-2">
        <label className="flex items-center gap-1">
          <input type="checkbox" name="flags.featured" checked={form.flags?.featured ?? false} onChange={handleChange} />
          Destacada
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" name="flags.opportunity" checked={form.flags?.opportunity ?? false} onChange={handleChange} />
          Oportunidad
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" name="flags.premium" checked={form.flags?.premium ?? false} onChange={handleChange} />
          Premium
        </label>
      </div>

      {/* Descripción */}
      <div>
        <label className="block font-semibold">Descripción</label>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block font-semibold">Tags</label>
        {(form.tags ?? []).map((tag, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <input
              type="text"
              value={tag}
              onChange={(e) => updateTag(i, e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
            <button type="button" onClick={() => removeTag(i)} className="bg-red-600 px-2 rounded">X</button>
          </div>
        ))}
        <button type="button" onClick={addTag} className="bg-green-600 px-3 py-1 rounded mt-1">Agregar Tag</button>
      </div>

      {/* Imágenes */}
      <div>
        <label className="block font-semibold mb-1">Imágenes</label>
        <div className="flex flex-wrap gap-4 mb-2">
          {(form.images ?? []).map((img, i) => (
            <div key={i} className="relative w-32 h-32 border border-gray-600 rounded overflow-hidden">
              <Image src={img} alt={`Imagen ${i}`} fill style={{ objectFit: "cover" }} />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-red-600 text-white px-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="text-white"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block font-semibold">Estado</label>
        <select
          name="status"
          value={form.status || "active"}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold mt-4">
        Guardar Cambios
      </button>
    </form>
  );
}
