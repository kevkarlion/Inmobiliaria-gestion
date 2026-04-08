/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent, useEffect, useMemo } from "react";
import { PropertyResponse } from "@/dtos/property/property-response.dto";
import { mapPropertyToForm } from "@/domain/mappers/propertyToForm.mapper";
import CloudinaryUploader from '@/components/CloudinaryUploader/CloudinaryUploader';
import MultiResolutionUploader from '@/components/CloudinaryUploader/MultiResolutionUploader';
import SortableImageGrid from "@/components/shared/SortableImage/SortableImageGrid";
import { toast } from "sonner";

// Componentes de Shadcn/UI
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertModal } from "@/components/ui/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditPropertyFormProps {
  property: PropertyResponse;
  slug: string;
  onClose: () => void;
  onUpdate: (updatedProperty: PropertyResponse) => void;
}

export default function EditPropertyForm({ property, slug, onClose, onUpdate }: EditPropertyFormProps) {
  const [form, setForm] = useState<any>(() => mapPropertyToForm(property));
  const [loading, setLoading] = useState(false);

  // Alert modal state
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertModalOpen(true);
  };

  useEffect(() => {
    setForm(mapPropertyToForm(property));
  }, [property]);

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
      { label: "Choele Choel" , value: "choele-choel" },
      { label: "El Bolsón", value: "el-bolson" },
      { label: "Fernández Oro", value: "fernandez-oro" },
      { label: "General Roca", value: "general-roca" },
      { label: "Ingeniero Huergo", value: "ingeniero-huergo" },
      { label: "Las Grutas", value: "las-grutas" },
      { label: "Mainqué", value: "mainque" },
      { label: "Punta Colorada", value: "punta-colorada" },
      { label: "San Carlos de Bariloche", value: "bariloche" },
      { label: "Sierra Grande", value: "sierra-grande" },
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

    setForm((prev: any) => ({ ...prev, [name]: finalValue }));
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev: any) => {
      const newState = { ...prev, [name]: value };
      if (name === "province") newState.city = ""; 
      return newState;
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setForm((prev: any) => ({ ...prev, [name]: checked }));
  };

  const handleImagesUpload = (urls: string[]) => {
    setForm((prev: any) => ({
      ...prev,
      images: [...(prev.images || []), ...urls],
    }));
  };

  const handleDesktopImagesUpload = (urls: string[]) => {
    setForm((prev: any) => ({
      ...prev,
      imagesDesktop: [...(prev.imagesDesktop || []), ...urls],
    }));
  };

  const handleMobileImagesUpload = (urls: string[]) => {
    setForm((prev: any) => ({
      ...prev,
      imagesMobile: [...(prev.imagesMobile || []), ...urls],
    }));
  };

  const removeImage = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleReorder = (reorderedImages: string[]) => {
    setForm((prev: any) => ({ ...prev, images: reorderedImages }));
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

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      if (!res.ok) {
        const errPayload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");
        const message =
          (typeof errPayload === "object" && errPayload && "message" in errPayload && typeof (errPayload as any).message === "string"
            ? (errPayload as any).message
            : typeof errPayload === "string" && errPayload.trim()
              ? errPayload
              : "Error al editar");
        throw new Error(message);
      }

      if (!isJson) throw new Error("Respuesta inválida del servidor (no es JSON)");

      const updatedProperty: PropertyResponse = await res.json();
      toast.success("Propiedad editada correctamente", {
        description: `Los cambios en ${updatedProperty.title} han sido guardados.`,
      });
      onUpdate(updatedProperty);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al actualizar la propiedad");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 bg-neutral-900 text-white rounded-2xl space-y-8 border border-white/10 shadow-2xl relative">
      
      {/* HEADER FIJO */}
      <div className="flex justify-between items-center border-b border-white/10 pb-6 sticky top-0 bg-neutral-900 z-60">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-blue-500">Editar Propiedad</h2>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] italic truncate max-w-75">
            Editando: {property.title}
          </p>
        </div>
        <Button variant="ghost" type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-full h-10 w-10 p-0">
          ✕
        </Button>
      </div>

      {/* SECCIÓN 1: DATOS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Título *</Label>
          <Input name="title" value={form.title || ""} onChange={handleChange} className="bg-white/5 border-white/10 focus:border-blue-500 h-12" required />
        </div>
        <div className="md:col-span-1 space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo</Label>
          <Select value={form.propertyTypeSlug || "casa"} onValueChange={(v) => handleSelectChange("propertyTypeSlug", v)}>
            <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-white/10 text-white z-[100]">
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="departamento">Departamento</SelectItem>
              <SelectItem value="departamento-en-pozo">Depto. en Pozo</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
              <SelectItem value="loteos">Loteos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Operación</Label>
          <Select value={form.operationType || "venta"} onValueChange={(v) => handleSelectChange("operationType", v)}>
            <SelectTrigger className="bg-white/5 border-white/10 h-12">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-white/10 text-white z-[100]">
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
          <Select 
            value={form.priceOption || "amount"} 
            onValueChange={(v: "amount" | "consult") => {
              setForm((prev: any) => ({
                ...prev,
                priceOption: v,
                // Si selecciona "consultar", limpiamos el monto
                priceAmount: v === "consult" ? 0 : prev.priceAmount
              }));
            }}
          >
            <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-neutral-800 border-white/10 text-white z-[100]">
              <SelectItem value="amount">Ingresar monto</SelectItem>
              <SelectItem value="consult">Consultar Precio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Solo mostrar si选择了 monto */}
        {form.priceOption === "amount" && (
          <>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monto</Label>
              <Input 
                type="text" 
                inputMode="numeric" 
                pattern="[0-9]*" 
                name="priceAmount" 
                value={form.priceAmount ?? ""} 
                onChange={handleChange} 
                className="bg-white/5 border-white/10 h-12" 
                placeholder="Ej: 150000" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Moneda</Label>
              <Select value={form.currency || "USD"} onValueChange={(v) => handleSelectChange("currency", v)}>
                <SelectTrigger className="bg-white/5 border-white/10 h-12">
                  <SelectValue placeholder="Moneda" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-neutral-800 border-white/10 text-white z-[100]">
                  <SelectItem value="USD">USD (Dólares)</SelectItem>
                  <SelectItem value="ARS">ARS (Pesos)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        {/* Si选择了 consultar o no hay selección, mostrar teléfono en los espacios restantes */}
        {(form.priceOption === "consult" || !form.priceOption) && (
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teléfono</Label>
            <Input name="contactPhone" value={form.contactPhone || ""} onChange={handleChange} className="bg-white/5 border-white/10 h-12" />
          </div>
        )}
        
        {/* Si选择了 monto, mostrar teléfono en el tercer espacio */}
        {form.priceOption === "amount" && (
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teléfono</Label>
            <Input name="contactPhone" value={form.contactPhone || ""} onChange={handleChange} className="bg-white/5 border-white/10 h-12" />
          </div>
        )}
      </div>

      {/* SECCIÓN 3: UBICACIÓN Y DIRECCIÓN */}
      <div className="p-6 bg-blue-600/5 rounded-2xl border border-blue-500/20 space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-blue-500 rounded-full" />
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Ubicación y Dirección</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provincia *</Label>
            <Select value={form.province || ""} onValueChange={(v) => handleSelectChange("province", v)}>
              <SelectTrigger className="bg-neutral-800 border-white/10 h-12 text-white">
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-white/10 text-white z-[100]">
                {provinces.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Localidad *</Label>
            <Select value={form.city || ""} onValueChange={(v) => handleSelectChange("city", v)} disabled={!form.province}>
              <SelectTrigger className="bg-neutral-800 border-white/10 h-12 text-white">
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-white/10 text-white z-[100]">
                {form.province && citiesByProvince[form.province]?.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Barrio (Slug)</Label>
            <Input name="barrio" value={form.barrio || ""} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calle</Label>
            <Input name="street" value={form.street || ""} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Altura</Label>
            <Input name="number" value={form.number || ""} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">C.P.</Label>
            <Input name="zipCode" value={form.zipCode || ""} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" />
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: CARACTERÍSTICAS TÉCNICAS */}
      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {[
            {l: "Dorm", n: "bedrooms"}, {l: "Baños", n: "bathrooms"}, {l: "Amb", n: "rooms"}, 
            {l: "Total m2", n: "totalM2"}, {l: "Cub. m2", n: "coveredM2"}, {l: "Antigüedad", n: "age"}
          ].map((i) => (
            <div key={i.n} className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-500 uppercase">{i.l}</Label>
              <Input 
                type="number" 
                name={i.n} 
                value={form[i.n] ?? ""} 
                onChange={handleChange} 
                className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus:border-blue-500 h-10 transition-colors" 
              />
            </div>
          ))}
        </div>

        {/* Ancho y Largo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-500 uppercase">Ancho (m)</Label>
            <Input 
              type="number" 
              name="width" 
              value={form.width ?? ""} 
              onChange={handleChange} 
              className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus:border-blue-500 h-10 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-500 uppercase">Largo (m)</Label>
            <Input 
              type="number" 
              name="length" 
              value={form.length ?? ""} 
              onChange={handleChange} 
              className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus-visible:ring-0 focus:border-blue-500 h-10 transition-colors" 
            />
          </div>
        </div>

        {/* Servicios */}
        <div className="mt-6">
          <Label className="text-[10px] font-bold text-gray-500 uppercase block mb-3">Servicios</Label>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Luz", value: "luz" },
              { label: "Agua", value: "agua" },
              { label: "Gas", value: "gas" },
              { label: "Internet", value: "internet" },
              { label: "Cloacas", value: "cloacas" },
              { label: "Cordón Cuneta", value: "cordon-cuneta" },
            ].map((service) => (
              <label key={service.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.services?.includes?.(service.value) || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((prev: any) => ({
                      ...prev,
                      services: checked 
                        ? [...(prev.services || []), service.value]
                        : (prev.services || []).filter((s: string) => s !== service.value)
                    }));
                  }}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{service.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* SECCIÓN 5: MAPA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Latitud</Label>
          <Input type="number" step="any" name="lat" value={form.lat ?? ""} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Longitud</Label>
          <Input type="number" step="any" name="lng" value={form.lng ?? ""} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL Mapa / Iframe</Label>
          <Input name="mapsUrl" value={form.mapsUrl || ""} onChange={handleChange} className="bg-neutral-800 border-white/10 h-12" />
        </div>
      </div>

      {/* SECCIÓN 6: MULTIMEDIA */}
      <div className="space-y-4">
        <Label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Imágenes Multi-Resolución</Label>
        <MultiResolutionUploader 
          onImagesDesktop={handleDesktopImagesUpload}
          onImagesMobile={handleMobileImagesUpload}
          existingDesktop={form.imagesDesktop || []}
          existingMobile={form.imagesMobile || []}
        />
        
        {/* Legacy images section - keep for backward compatibility */}
        <div className="pt-6 border-t border-white/10">
          <Label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Galería Legacy</Label>
          <CloudinaryUploader onImageUpload={handleImagesUpload} folder="properties" />
          <SortableImageGrid
            images={form.images || []}
            onReorder={handleReorder}
            onRemove={removeImage}
          />
        </div>
      </div>

      {/* SECCIÓN 7: FLAGS */}
      <div className="flex flex-wrap gap-8 py-6 border-y border-white/5">
        {/* Tipo de cochera */}
        <div className="flex items-center space-x-3 group">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Cochera
          </Label>
          <Select 
            value={form.garageType || "ninguno"} 
            onValueChange={(v: "cochera" | "entrada" | "ninguno") => {
              setForm((prev: any) => ({
                ...prev,
                garageType: v,
                garage: v !== "ninguno"
              }));
            }}
          >
            <SelectTrigger className="bg-white/5 border-white/10 w-40">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-white/10 text-white z-[100] max-h-[300px] overflow-y-auto">
              <SelectItem value="ninguno">Sin cochera</SelectItem>
              <SelectItem value="cochera">Cochera</SelectItem>
              <SelectItem value="entrada">Entrada de vehículo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Otros flags */}
        {[
          {label: "Destacada", name: "featured"},
          {label: "Oportunidad", name: "opportunity"},
          {label: "Premium", name: "premium"},
        ].map((check) => (
          <div key={check.name} className="flex items-center space-x-3 group cursor-pointer">
            <Checkbox 
              id={`edit-${check.name}`}
              checked={!!form[check.name]}
              onCheckedChange={(checked) => handleCheckboxChange(check.name, checked as boolean)}
              className="border-white/20 data-[state=checked]:bg-blue-600"
            />
            <Label htmlFor={`edit-${check.name}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 cursor-pointer">
              {check.label}
            </Label>
          </div>
        ))}
      </div>

      {/* SECCIÓN 8: DESCRIPCIÓN */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descripción General</Label>
        <Textarea name="description" value={form.description || ""} onChange={handleChange} rows={5} className="bg-white/5 border-white/10 focus:border-blue-500 rounded-xl resize-none shadow-inner" />
      </div>

      {/* BOTÓN FINAL */}
      <Button 
        type="submit" 
        disabled={loading} 
        className={`w-full h-16 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] ${
          loading ? 'bg-neutral-800' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/20'
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Actualizando...
          </div>
        ) : "Guardar Cambios"}
      </Button>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModalOpen}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertModalOpen(false)}
      />
    </form>
  );
}
