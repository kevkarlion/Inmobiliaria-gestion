/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent, useMemo } from "react";
import Image from "next/image";
import { PropertyFormType } from "@/domain/types/PropertyFormType.types";
import { PropertyResponse } from "@/dtos/property/property-response.dto";
import CloudinaryUploader from '@/components/CloudinaryUploader/CloudinaryUploader';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreatePropertyFormProps {
  onClose: () => void;
  onCreate?: (newProperty: PropertyResponse) => void;
}

export default function CreatePropertyForm({ onClose, onCreate }: CreatePropertyFormProps) {
  const [form, setForm] = useState<PropertyFormType & { contactPhone: string }>({
    title: "",
    operationType: "venta",
    propertyTypeSlug: "casa",
    contactPhone: '',
    province: "",
    city: "",
    barrio: "",
    priceAmount: 0,
    currency: "USD",
    bedrooms: 0,
    bathrooms: 0,
    totalM2: 0,
    coveredM2: 0,
    rooms: 0,
    garage: false,
    age: 0,
    features: "",
    street: "",
    number: "",
    zipCode: "",
    mapsUrl: "",
    lat: 0,
    lng: 0,
    featured: false,
    opportunity: false,
    premium: false,
    tags: [],
    images: [],
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // 1. DATA DE PROVINCIAS (Ordenadas)
  const provinces = useMemo(() => [
    { label: "Buenos Aires", value: "buenos-aires" },
    { label: "Neuquén", value: "neuquen" },
    { label: "Río Negro", value: "rio-negro" },
    { label: "Otra Provincia", value: "otra-provincia" },
  ].sort((a, b) => a.label.localeCompare(b.label)), []);

  // 2. DATA DE LOCALIDADES (Mapeadas por provincia y ordenadas)
  const citiesByProvince: Record<string, {label: string, value: string}[]> = {
    "rio-negro": [
      { label: "Allen", value: "allen" },
      { label: "Catriel", value: "catriel" },
      { label: "Cervantes", value: "cervantes" },
      { label: "Cinco Saltos", value: "cinco-saltos" },
      { label: "Cipolletti", value: "cipolletti" },
      { label: "Choele Choel", value: "choele-choel" },
      { label: "El Bolsón", value: "el-bolson" },
      { label: "Fernández Oro", value: "fernandez-oro" },
      { label: "General Roca", value: "general-roca" },
      { label: "Ingeniero Huergo", value: "ingeniero-huergo" },
      { label: "Las Grutas", value: "las-grutas" },
      { label: "Mainqué", value: "mainque" },
      { label: "San Carlos de Bariloche", value: "bariloche" },
      { label: "Viedma", value: "viedma" },
      { label: "Otras localidades (Río Negro)", value: "otras-rio-negro" },
    ].sort((a, b) => a.label.localeCompare(b.label)),

    "neuquen": [
      { label: "Añelo", value: "anelo" },
      { label: "Centenario", value: "centenario" },
      { label: "Cutral Có", value: "cutral-co" },
      { label: "Neuquén Capital", value: "neuquen-capital" },
      { label: "Plaza Huincul", value: "plaza-huincul" },
      { label: "Plottier", value: "plottier" },
      { label: "San Martín de los Andes", value: "san-martin-de-los-andes" },
      { label: "Villa La Angostura", value: "villa-la-angostura" },
      { label: "Otras localidades (Neuquén)", value: "otras-neuquen" },
    ].sort((a, b) => a.label.localeCompare(b.label)),

    "buenos-aires": [
      { label: "Bahía Blanca", value: "bahia-blanca" },
      { label: "CABA", value: "caba" },
      { label: "La Plata", value: "la-plata" },
      { label: "Mar del Plata", value: "mar-del-plat" },
      { label: "Pilar", value: "pilar" },
      { label: "Tandil", value: "tandil" },
      { label: "Tigre", value: "tigre" },
      { label: "Otras localidades (Buenos Aires)", value: "otras-buenos-aires" },
    ].sort((a, b) => a.label.localeCompare(b.label)),

    "otra-provincia": [
      { label: "Otra localidad / Consultar", value: "generica-consultar" }
    ]
  };

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
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm(prev => {
      const newState = { ...prev, [name]: value };
      // Si cambia la provincia, reseteamos la ciudad para evitar inconsistencias
      if (name === "province") newState.city = "";
      return newState;
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleImagesUpload = (urls: string[]) => {
    setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al guardar");

      alert("¡Propiedad publicada con éxito!");
      if (onCreate) onCreate(data);
      onClose();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 bg-neutral-900 text-white rounded-2xl space-y-8 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] relative scrollbar-hide">
      
      {/* HEADER FIJO */}
      <div className="flex justify-between items-center border-b border-white/10 pb-6 sticky top-0 bg-neutral-900 z-60">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-blue-500">Nueva Propiedad</h2>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] italic">Sistema de Gestión Inmobiliaria</p>
        </div>
        <Button variant="ghost" type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-full h-10 w-10 p-0">
          ✕
        </Button>
      </div>

      {/* SECCIÓN 1: DATOS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Título de la Publicación *</Label>
          <Input name="title" value={form.title} onChange={handleChange} className="bg-white/5 border-white/10 focus:border-blue-500 h-12" placeholder="Ej: Casa Moderna en Barrio Norte" required />
        </div>
        <div className="md:col-span-1 space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo de Propiedad</Label>
          <Select value={form.propertyTypeSlug} onValueChange={(v) => handleSelectChange("propertyTypeSlug", v)}>
            <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-neutral-800 border-white/10 text-white z-200">
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
              <SelectItem value="departamento">Departamento</SelectItem>
              <SelectItem value="local">Local Comercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Operación</Label>
          <Select value={form.operationType} onValueChange={(v) => handleSelectChange("operationType", v)}>
            <SelectTrigger className="bg-white/5 border-white/10 h-12">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-neutral-800 border-white/10 text-white z-200">
              <SelectItem value="venta">Venta</SelectItem>
              <SelectItem value="alquiler">Alquiler</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* SECCIÓN 2: PRECIO Y CONTACTO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Precio *</Label>
          <Input type="number" name="priceAmount" value={form.priceAmount || ""} onChange={handleChange} className="bg-white/5 border-white/10 h-12" required />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Moneda</Label>
          <Select value={form.currency} onValueChange={(v) => handleSelectChange("currency", v)}>
            <SelectTrigger className="bg-white/5 border-white/10 h-12">
              <SelectValue placeholder="Moneda" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-neutral-800 border-white/10 text-white z-200">
              <SelectItem value="USD">USD (Dólares)</SelectItem>
              <SelectItem value="ARS">ARS (Pesos)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teléfono de Contacto</Label>
          <Input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="Ej: 2984123456" className="bg-white/5 border-white/10 h-12" />
        </div>
      </div>

      {/* SECCIÓN 3: UBICACIÓN TÉCNICA */}
      <div className="p-6 bg-blue-600/5 rounded-2xl border border-blue-500/20 space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-blue-500 rounded-full" />
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Localización y Dirección</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provincia *</Label>
            <Select value={form.province} onValueChange={(v) => handleSelectChange("province", v)}>
              <SelectTrigger className="bg-neutral-800 border-white/10 h-12 text-white">
                <SelectValue placeholder="Seleccionar Provincia" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-neutral-800 border-white/10 text-white z-200">
                {provinces.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Localidad *</Label>
            <Select value={form.city} onValueChange={(v) => handleSelectChange("city", v)} disabled={!form.province}>
              <SelectTrigger className="bg-neutral-800 border-white/10 h-12 text-white disabled:opacity-30">
                <SelectValue placeholder="Seleccionar Ciudad" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-neutral-800 border-white/10 text-white z-200">
                {form.province && citiesByProvince[form.province]?.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Barrio (Slug)</Label>
            <Input name="barrio" value={form.barrio} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" placeholder="ej: barrio-norte" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calle</Label>
            <Input name="street" value={form.street} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Número/Altura</Label>
            <Input name="number" value={form.number} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Código Postal</Label>
            <Input name="zipCode" value={form.zipCode} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" />
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: CARACTERÍSTICAS TÉCNICAS */}
      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {[
            {label: "Dormitorios", name: "bedrooms"},
            {label: "Baños", name: "bathrooms"},
            {label: "Ambientes", name: "rooms"}, 
            {label: "Total m2", name: "totalM2"}, 
            {label: "Cubiertos m2", name: "coveredM2"}, 
            {label: "Antigüedad", name: "age"}
          ].map((item) => (
            <div key={item.name} className="space-y-2">
              <Label className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{item.label}</Label>
              <Input 
                type="number" 
                name={item.name} 
                value={(form as any)[item.name] || ""} 
                onChange={handleChange} 
                className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus:border-blue-500 transition-colors h-10" 
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 5: GOOGLE MAPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Latitud</Label>
          <Input type="number" step="any" name="lat" value={form.lat || ""} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" placeholder="-39.02" />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Longitud</Label>
          <Input type="number" step="any" name="lng" value={form.lng || ""} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" placeholder="-67.56" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL del Mapa (Iframe/Link)</Label>
          <Input name="mapsUrl" value={form.mapsUrl} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" />
        </div>
      </div>

      {/* SECCIÓN 6: MULTIMEDIA */}
      <div className="space-y-4">
        <Label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Galería de Imágenes</Label>
        <CloudinaryUploader onImageUpload={handleImagesUpload} folder="properties" />
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mt-4">
          {form.images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl border border-white/10 overflow-hidden group shadow-lg">
              <Image src={img} alt="preview" fill className="object-cover transition-transform group-hover:scale-110" unoptimized />
              <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 7: ETIQUETAS DE ESTADO (Flags) */}
      <div className="flex flex-wrap gap-8 py-6 border-y border-white/5">
        {[
          {label: "Destacada", name: "featured"},
          {label: "Oportunidad", name: "opportunity"},
          {label: "Premium", name: "premium"},
          {label: "Cochera", name: "garage"}
        ].map((check) => (
          <div key={check.name} className="flex items-center space-x-3 group cursor-pointer">
            <Checkbox 
              id={check.name}
              checked={(form as any)[check.name]}
              onCheckedChange={(checked) => handleCheckboxChange(check.name, checked as boolean)}
              className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor={check.name} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-blue-400 cursor-pointer transition-colors">
              {check.label}
            </Label>
          </div>
        ))}
      </div>

      {/* SECCIÓN 8: DESCRIPCIÓN */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descripción General de la Propiedad</Label>
        <Textarea name="description" value={form.description} onChange={handleChange} rows={6} className="bg-white/5 border-white/10 focus:border-blue-500 rounded-xl resize-none shadow-inner" placeholder="Escriba aquí los detalles destacados..." />
      </div>

      {/* BOTÓN DE ACCIÓN */}
      <Button 
        type="submit" 
        disabled={loading} 
        className={`w-full h-16 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] ${
          loading ? 'bg-neutral-800 text-gray-500' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-600/20'
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Publicando propiedad...
          </div>
        ) : "Publicar ahora"}
      </Button>
    </form>
  );
}