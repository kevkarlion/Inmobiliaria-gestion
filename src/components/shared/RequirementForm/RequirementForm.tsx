"use client";

import { useState } from "react";
import { RequirementResponse } from "@/dtos/requirement/requirement-response.dto";
import { RequirementStatus } from "@/domain/enums/requirement-status.enum";
import { X, Loader2 } from "lucide-react";

interface Props {
  clientId: string;
  requirement?: RequirementResponse;
  onClose: () => void;
  onCreate?: (requirement: RequirementResponse) => void;
  onUpdate?: (requirement: RequirementResponse) => void;
}

export default function RequirementForm({
  clientId,
  requirement,
  onClose,
  onCreate,
  onUpdate,
}: Props) {
  const isEdit = !!requirement;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [operationType, setOperationType] = useState<"venta" | "alquiler">(
    (requirement?.operationType as "venta" | "alquiler") || "alquiler"
  );
  const [priceMin, setPriceMin] = useState(requirement?.priceRange.min?.toString() || "");
  const [priceMax, setPriceMax] = useState(requirement?.priceRange.max?.toString() || "");
  const [bedrooms, setBedrooms] = useState(requirement?.features.bedrooms?.toString() || "1");
  const [bathrooms, setBathrooms] = useState(requirement?.features.bathrooms?.toString() || "1");
  const [minM2, setMinM2] = useState(requirement?.features.minM2?.toString() || "30");
  const [garage, setGarage] = useState(requirement?.features.garage || false);
  const [status, setStatus] = useState<RequirementStatus>(
    requirement?.status || RequirementStatus.ACTIVE
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    (requirement?.priority as "low" | "medium" | "high") || "medium"
  );
  const [notes, setNotes] = useState(requirement?.notes || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body = {
        clientId,
        operationType,
        propertyTypes: [],
        zones: [],
        priceRange: {
          min: Number(priceMin) || 0,
          max: priceMax ? Number(priceMax) : undefined,
        },
        features: {
          bedrooms: Number(bedrooms) || 1,
          bathrooms: Number(bathrooms) || 1,
          minM2: Number(minM2) || 30,
          garage,
        },
        status,
        priority,
        notes,
      };

      const url = isEdit
        ? `/api/admin/requirements/${requirement.id}`
        : "/api/admin/requirements";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al guardar requisito");
      }

      const savedReq: RequirementResponse = await res.json();

      if (isEdit && onUpdate) {
        onUpdate(savedReq);
      } else if (!isEdit && onCreate) {
        onCreate(savedReq);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">
          {isEdit ? "Editar Requisito" : "Nuevo Requisito"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-slate-500" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de operación */}
        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">
            Tipo de Operación
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOperationType("alquiler")}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                operationType === "alquiler"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Alquiler
            </button>
            <button
              type="button"
              onClick={() => setOperationType("venta")}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                operationType === "venta"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Venta
            </button>
          </div>
        </div>

        {/* Precio */}
        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">
            Rango de Precio (USD)
          </h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Mínimo
              </label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50000"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Máximo
              </label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="150000"
              />
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">
            Características
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Habitaciones
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">Studio</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Baños
              </label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                M² mínimos
              </label>
              <input
                type="number"
                value={minM2}
                onChange={(e) => setMinM2(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={garage}
                  onChange={(e) => setGarage(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-600">Requiere cochera</span>
              </label>
            </div>
          </div>
        </div>

        {/* Estado y Prioridad */}
        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">
            Estado y Prioridad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RequirementStatus)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={RequirementStatus.ACTIVE}>Activo</option>
                <option value={RequirementStatus.MATCHED}>Con Coincidencias</option>
                <option value={RequirementStatus.FULFILLED}>Cumplido</option>
                <option value={RequirementStatus.CANCELLED}>Cancelado</option>
                <option value={RequirementStatus.EXPIRED}>Expirado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">
            Notas
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Notas adicionales sobre el requisito..."
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 px-6 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isEdit ? "Guardar Cambios" : "Crear Requisito"}
          </button>
        </div>
      </form>
    </div>
  );
}
