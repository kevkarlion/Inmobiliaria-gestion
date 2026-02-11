/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import { PropertyResponse } from "@/dtos/property/property-response.dto";
import { mapPropertyToForm } from "@/domain/mappers/propertyToForm.mapper";
import CloudinaryUploader from '@/components/CloudinaryUploader/CloudinaryUploader';

interface EditPropertyFormProps {
  property: PropertyResponse;
  slug: string;
  onClose: () => void;
  onUpdate: (updatedProperty: PropertyResponse) => void;
}

export default function EditPropertyForm({ property, slug, onClose, onUpdate }: EditPropertyFormProps) {
  const [form, setForm] = useState<any>(() => mapPropertyToForm(property));
  const [loading, setLoading] = useState(false);
  console.log('property', property)
  useEffect(() => {
    setForm(mapPropertyToForm(property));
  }, [property]);
  
  console.log('form', form)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    let finalValue: any;

    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      finalValue = value === "" ? 0 : Number(value);
    } else {
      finalValue = value;
    }

    setForm((prev: any) => ({ ...prev, [name]: finalValue }));
  }

  const handleImagesUpload = (urls: string[]) => {
    setForm((prev: any) => ({
      ...prev,
      images: [...(prev.images || []), ...urls],
    }));
  };

  const removeImage = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index),
    }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), 
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al editar");
      }
      const updatedProperty: PropertyResponse = await res.json(); 
      alert("¡Propiedad actualizada con éxito!");
      onUpdate(updatedProperty);
      onClose();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-neutral-900 text-white rounded-xl space-y-6 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-blue-500">Editar Propiedad</h2>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest italic">Original: {property.title}</p>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">Cerrar ✕</button>
      </div>

      {/* SECCIÓN 1: DATOS BÁSICOS Y CONTACTO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Título *</label>
          <input type="text" name="title" value={form.title || ""} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-blue-500" required />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Teléfono de Contacto</label>
          <input type="text" name="contactPhone" value={form.contactPhone || ""} onChange={handleChange} placeholder="Ej: 2984123456" className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Operación</label>
          <select name="operationType" value={form.operationType || "venta"} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none text-white">
            <option value="venta" className="text-black">Venta</option>
            <option value="alquiler" className="text-black">Alquiler</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Precio *</label>
          <input type="number" name="priceAmount" value={form.priceAmount ?? ""} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none" required />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Moneda</label>
          <select name="currency" value={form.currency || "USD"} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none text-white">
            <option value="USD" className="text-black">USD (Dólares)</option>
            <option value="ARS" className="text-black">ARS (Pesos)</option>
          </select>
        </div>
      </div>

      {/* SECCIÓN 2: LOCALIZACIÓN GEOGRÁFICA */}
      <div className="p-4 bg-blue-600/5 rounded-xl border border-blue-500/20 space-y-4">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Localización y Zona</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Provincia *</label>
            <select name="province" value={form.province|| ""} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-white/10 rounded-lg outline-none text-white" required>
              <option value="">Seleccionar...</option>
              <option value="rio-negro" className="text-black">Río Negro</option>
              <option value="neuquen" className="text-black">Neuquén</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Localidad *</label>
            <select name="city" value={form.city || ""} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-white/10 rounded-lg outline-none text-white" required disabled={!form.province}>
              <option value="">Seleccionar...</option>
              <option value="general-roca" className="text-black">General Roca</option>
              <option value="cipolletti" className="text-black">Cipolletti</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Barrio (Slug)</label>
            <input type="text" name="barrio" value={form.barrio || ""} onChange={handleChange} placeholder="ej: barrio-norte" className="w-full p-3 bg-neutral-800 border border-white/10 rounded-lg outline-none" disabled={!form.city} />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: CONFIGURACIÓN DE MAPA */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
        <div className="flex items-center gap-2">
           <span className="text-blue-500 text-lg">📍</span>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coordenadas y Google Maps</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Link o Iframe de Google Maps</label>
            <input type="text" name="mapsUrl" value={form.mapsUrl || ""} onChange={handleChange} placeholder="Pegue aquí el link" className="w-full p-3 bg-neutral-800 border border-white/10 rounded-lg outline-none focus:border-blue-500 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Latitud</label>
            <input type="number" step="any" name="lat" value={form.lat ?? ""} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-white/10 rounded-lg outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Longitud</label>
            <input type="number" step="any" name="lng" value={form.lng ?? ""} onChange={handleChange} className="w-full p-3 bg-neutral-800 border border-white/10 rounded-lg outline-none" />
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: DIRECCIÓN Y TIPO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Calle</label>
          <input type="text" name="street" value={form.street || ""} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Altura / Nro</label>
          <input type="text" name="number" value={form.number || ""} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Tipo de Propiedad</label>
          <select name="propertyTypeSlug" value={form.propertyTypeSlug || "casa"} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none text-white">
            <option value="casa" className="text-black">Casa</option>
            <option value="departamento" className="text-black">Departamento</option>
            <option value="terreno" className="text-black">Terreno</option>
            <option value="local" className="text-black">Local Comercial</option>
          </select>
        </div>
      </div>

      {/* SECCIÓN 5: CARACTERÍSTICAS TÉCNICAS (CON ANTIGUEDAD) */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
        {[
          {l: "Dorm", n: "bedrooms"}, 
          {l: "Baños", n: "bathrooms"}, 
          {l: "Amb", n: "rooms"}, 
          {l: "Total m2", n: "totalM2"}, 
          {l: "Cub. m2", n: "coveredM2"}, 
          {l: "Antigüedad", n: "age"} // 👈 Corregido a 'age' para consistencia con el DTO
        ].map((i) => (
          <div key={i.n}>
            <label className="text-[10px] font-bold text-gray-500 uppercase">{i.l}</label>
            <input type="number" name={i.n} value={form[i.n] ?? ""} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 p-1 outline-none focus:border-blue-500 transition-colors" />
          </div>
        ))}
      </div>

      {/* SECCIÓN 6: MULTIMEDIA */}
      <div className="space-y-4">
        <label className="block text-sm font-bold uppercase tracking-tight">Galería de Imágenes</label>
        <CloudinaryUploader onImageUpload={handleImagesUpload} folder="properties" />
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {form.images?.map((img: string, idx: number) => (
            <div key={idx} className="relative aspect-square rounded-lg border border-white/10 overflow-hidden group">
              <Image src={img} alt="preview" fill className="object-cover" unoptimized />
              <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-600/90 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity font-bold">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 7: FLAGS */}
      <div className="flex flex-wrap gap-4 py-4 border-y border-white/5 uppercase text-[10px] font-bold">
        {[{label: "Destacada", name: "featured"}, {label: "Oportunidad", name: "opportunity"}, {label: "Premium", name: "premium"}, {label: "Cochera", name: "garage"}].map((check) => (
          <label key={check.name} className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors">
            <input type="checkbox" name={check.name} checked={!!form[check.name]} onChange={handleChange} className="w-4 h-4 rounded accent-blue-600 bg-neutral-800" />
            {check.label}
          </label>
        ))}
      </div>

      {/* SECCIÓN 8: DESCRIPCIÓN */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase">Descripción de la propiedad</label>
        <textarea name="description" value={form.description || ""} onChange={handleChange} rows={4} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-blue-500 resize-none" />
      </div>

      <button type="submit" disabled={loading} className={`w-full ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} py-4 rounded-xl font-black uppercase text-sm active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20`}>
        {loading ? "Guardando cambios..." : "Actualizar Propiedad"}
      </button>
    </form>
  );
}