/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { PropertyFormType } from "@/domain/types/PropertyFormType.types";

interface CreatePropertyFormProps {
  onClose: () => void;
}

export default function CreatePropertyForm({ onClose }: CreatePropertyFormProps) {
  const [form, setForm] = useState<PropertyFormType>({
    title: "",
    operationType: "venta",
    propertyTypeSlug: "",
    zoneSlug: "",
    priceAmount: 0,
    currency: "USD",
    bedrooms: 0,
    bathrooms: 0,
    totalM2: 0,
    coveredM2: 0,
    rooms: 0,
    garage: false,
    featured: false,
    features: "",
    opportunity: false,
    premium: false,
    street: "",
    number: "",
    zipCode: "",
    mapsUrl: "",
    lat: 0,
    lng: 0,
    tags: [],
    images: [],
    description: "",
    age: 0,
  });

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    let finalValue: any;
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      finalValue = Number(value);
    } else {
      finalValue = value;
    }
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error");
      alert("¡Propiedad creada!");
      onClose();
    } catch (error) {
      alert("Error al guardar");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-neutral-900 text-white rounded-xl space-y-4 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Nueva Propiedad</h2>
        <button type="button" onClick={onClose} className="hover:text-red-500 transition-colors">Cerrar ✕</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Título</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none" required />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Precio</label>
          <input type="number" name="priceAmount" value={form.priceAmount} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Moneda</label>
          <select name="currency" value={form.currency} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none text-white">
            <option value="USD" className="text-black">USD</option>
            <option value="ARS" className='text-black'>ARS</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Maps URL</label>
          <input type="text" name="mapsUrl" value={form.mapsUrl} onChange={handleChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Latitud</label>
          <input type="number" name="lat" value={form.lat} onChange={handleChange} step="any" className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Longitud</label>
          <input type="number" name="lng" value={form.lng} onChange={handleChange} step="any" className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input type="text" name="propertyTypeSlug" value={form.propertyTypeSlug} onChange={handleChange} placeholder="Categoría Slug" className="p-3 bg-white/5 border border-white/10 rounded-lg" />
        <input type="text" name="zoneSlug" value={form.zoneSlug} onChange={handleChange} placeholder="Zona Slug" className="p-3 bg-white/5 border border-white/10 rounded-lg" />
        <input type="text" name="street" value={form.street} onChange={handleChange} placeholder="Calle" className="p-3 bg-white/5 border border-white/10 rounded-lg" />
        <input type="text" name="number" value={form.number} onChange={handleChange} placeholder="Altura" className="p-3 bg-white/5 border border-white/10 rounded-lg" />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
        {[{l: "Dorm", n: "bedrooms"}, {l: "Baños", n: "bathrooms"}, {l: "Amb", n: "rooms"}, {l: "Total m2", n: "totalM2"}, {l: "Cub. m2", n: "coveredM2"}, {l: "Edad", n: "age"}].map((i) => (
          <div key={i.n}>
            <label className="text-[10px] font-bold text-gray-500 uppercase">{i.l}</label>
            <input type="number" name={i.n} value={(form as any)[i.n]} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 p-1 outline-none" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold uppercase">Galería</label>
        <div className="relative w-full h-24 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center cursor-pointer">
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          <span className="text-gray-500 text-xs uppercase">Click para subir</span>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {form.images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded border border-white/10 overflow-hidden">
              <Image src={img} alt="preview" fill className="object-cover" unoptimized />
              <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-600 text-[10px] px-1">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 py-2 border-y border-white/5 uppercase text-[10px]">
        {["featured", "opportunity", "premium", "garage"].map((check) => (
          <label key={check} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name={check} checked={(form as any)[check]} onChange={handleChange} className="w-4 h-4 rounded accent-blue-600" />
            {check}
          </label>
        ))}
      </div>

      <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Descripción..." className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none" />

      <button type="submit" className="w-full bg-blue-600 py-4 rounded-xl font-black uppercase text-sm active:scale-95 transition-all">Publicar</button>
    </form>
  );
}