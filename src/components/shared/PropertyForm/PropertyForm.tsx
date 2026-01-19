"use client";

import { useState, ChangeEvent, FormEvent } from "react";
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
    price: { amount: 0, currency: "USD" },
    features: { bedrooms: 0, bathrooms: 0, totalM2: 0, coveredM2: 0, rooms: 0, garage: false },
    flags: { featured: false, opportunity: false, premium: false },
    address: { street: "", number: "", zipCode: "" },
    age: 0,
    tags: [],
    images: [],
    description: "",
  });

  // 🔹 Manejo de cambios tipado
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, key] = name.split(".");
      const parentObj = form[parent as keyof PropertyFormType] || {};

      if (type === "checkbox") {
        const target = e.target as HTMLInputElement;
        setForm({
          ...form,
          [parent]: {
            ...parentObj,
            [key]: target.checked,
          },
        } as PropertyFormType);
      } else if (type === "number") {
        setForm({
          ...form,
          [parent]: {
            ...parentObj,
            [key]: Number(value),
          },
        } as PropertyFormType);
      } else {
        setForm({
          ...form,
          [parent]: {
            ...parentObj,
            [key]: value,
          },
        } as PropertyFormType);
      }
    } else {
      if (type === "checkbox") {
        const target = e.target as HTMLInputElement;
        setForm({
          ...form,
          [name]: target.checked,
        } as PropertyFormType);
      } else if (type === "number") {
        setForm({
          ...form,
          [name]: Number(value),
        } as PropertyFormType);
      } else {
        setForm({
          ...form,
          [name]: value,
        } as PropertyFormType);
      }
    }
  }

  // 🔹 Envío del formulario
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log("Form data:", form);

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error creando propiedad");

      const data = await res.json();
      console.log("Propiedad creada:", data);
      alert("Propiedad creada con éxito!");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear la propiedad");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-neutral-900 text-white rounded-lg space-y-4"
    >
      {/* Título + cerrar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Crear Propiedad</h1>
        <button
          type="button"
          onClick={onClose}
          className="text-red-500 hover:text-red-700 font-semibold"
        >
          ✕ Cerrar
        </button>
      </div>

      {/* Título */}
      <div>
        
        <label className="block font-semibold">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      </div>

      {/* Operación */}
      <div>
        <label className="block font-semibold">
          Operación <span className="text-red-500">*</span>
        </label>
        <select
          name="operationType"
          value={form.operationType}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
      </div>

      {/* Tipo de propiedad */}
      <div>
        <label className="block font-semibold">
          Tipo de Propiedad <span className="text-red-500">*</span>
        </label>
        <select
          name="propertyTypeSlug"
          value={form.propertyTypeSlug}
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
        <label className="block font-semibold">
          Zona <span className="text-red-500">*</span>
        </label>
        <select
          name="zoneSlug"
          value={form.zoneSlug}
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
          <label className="block font-semibold">Calle *</label>
          <input
            type="text"
            name="address.street"
            value={form.address.street}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">Número</label>
          <input
            type="text"
            name="address.number"
            value={form.address.number}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">CP</label>
          <input
            type="text"
            name="address.zipCode"
            value={form.address.zipCode}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
      </div>

      {/* Precio */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block font-semibold">Precio *</label>
          <input
            type="number"
            name="price.amount"
            value={form.price.amount}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">Moneda</label>
          <select
            name="price.currency"
            value={form.price.currency}
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
          <label className="block font-semibold">Total m²</label>
          <input
            type="number"
            name="features.totalM2"
            value={form.features.totalM2}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">Cubiertos m²</label>
          <input
            type="number"
            name="features.coveredM2"
            value={form.features.coveredM2}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">Dormitorios</label>
          <input
            type="number"
            name="features.bedrooms"
            value={form.features.bedrooms}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div>
          <label className="block font-semibold">Baños</label>
          <input
            type="number"
            name="features.bathrooms"
            value={form.features.bathrooms}
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
            value={form.features.rooms}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="features.garage"
            checked={form.features.garage}
            onChange={handleChange}
            className="h-5 w-5"
          />
          <label className="font-semibold">Garage</label>
        </div>
      </div>

      {/* Antigüedad */}
      <div>
        <label className="block font-semibold">Antigüedad (años)</label>
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      </div>

      {/* Flags */}
      <div className="flex gap-4 mt-2">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            name="flags.featured"
            checked={form.flags.featured}
            onChange={handleChange}
          />
          Destacada
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            name="flags.opportunity"
            checked={form.flags.opportunity}
            onChange={handleChange}
          />
          Oportunidad
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            name="flags.premium"
            checked={form.flags.premium}
            onChange={handleChange}
          />
          Premium
        </label>
      </div>

      {/* Descripción */}
      <div>
        <label className="block font-semibold">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold mt-4"
      >
        Crear Propiedad
      </button>
    </form>
  );
}
