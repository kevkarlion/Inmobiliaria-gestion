"use client";

import { useState } from "react";
import { ClientResponse } from "@/dtos/client/client-response.dto";
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { ClientSource } from "@/domain/enums/client-source.enum";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type PropertyTypeOption = "terreno" | "casa" | "loteo" | "depto";
type OperationTypeOption = "venta" | "alquiler" | "compra";

interface PropertyPreferenceForm {
  propertyType: PropertyTypeOption;
  zones: { province: string; city: string; barrio: string }[];
  priceRange: { min: string; max: string };
  features: Record<string, any>;
  notes: string;
}

interface Props {
  client?: ClientResponse;
  onClose: () => void;
  onCreate?: (client: ClientResponse) => void;
  onUpdate?: (client: ClientResponse) => void;
}

export function ClientForm({ client, onClose, onCreate, onUpdate }: Props) {
  const isEdit = !!client;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state - basic data
  const [name, setName] = useState(client?.name || "");
  const [email, setEmail] = useState(client?.email || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [status, setStatus] = useState<ClientStatus>(client?.status || ClientStatus.ACTIVE);
  const [source, setSource] = useState<ClientSource>(client?.source || ClientSource.OTHER);
  const [notes, setNotes] = useState(client?.notes || "");

  // Location state
  const [location, setLocation] = useState({
    province: client?.location?.province || "",
    city: client?.location?.city || "",
    barrio: client?.location?.barrio || "",
  });

  // Operation type
  const [operationType, setOperationType] = useState<OperationTypeOption>(
    (client?.preferences.operationType as OperationTypeOption) || "compra"
  );

  // Property preferences
  const [propertyPreferences, setPropertyPreferences] = useState<PropertyPreferenceForm[]>(() => {
    if (client?.preferences.propertyPreferences && client.preferences.propertyPreferences.length > 0) {
      return client.preferences.propertyPreferences.map(pref => ({
        propertyType: pref.propertyType as PropertyTypeOption,
        zones: pref.zones?.map(z => ({
          // Usar nombres guardados directamente, o slug si no hay nombre
          province: z.provinceName || z.province?.slug || "",
          city: z.cityName || z.city?.slug || "",
          barrio: z.barrio || "",
        })) || [],
        priceRange: {
          min: pref.priceRange?.min?.toString() || "",
          max: pref.priceRange?.max?.toString() || "",
        },
        features: pref.features || {},
        notes: pref.notes || "",
      }));
    }
    return [{ propertyType: "terreno", zones: [], priceRange: { min: "", max: "" }, features: {}, notes: "" }];
  });

  // Sale property (when operationType = "venta")
  const [saleProperty, setSaleProperty] = useState<{
    propertyType: PropertyTypeOption;
    address: string;
    googleMapsUrl: string;
    price: string;
    description: string;
    features: Record<string, any>;
    zones: { province: string; city: string; barrio: string }[];
    notes: string;
  }>(() => {
    const sp = client?.saleProperty;
    return {
      propertyType: (sp?.propertyType as PropertyTypeOption) || "casa",
      address: sp?.address || "",
      googleMapsUrl: sp?.googleMapsUrl || "",
      price: sp?.price?.toString() || "",
      description: sp?.description || "",
      features: sp?.features || {},
      zones: sp?.zones?.map(z => ({
        province: z.provinceName || z.province?.slug || "",
        city: z.cityName || z.city?.slug || "",
        barrio: z.barrio || "",
      })) || [],
      notes: sp?.notes || "",
    };
  });

  const addPropertyPreference = () => {
    setPropertyPreferences([
      ...propertyPreferences,
      { propertyType: "casa", zones: [], priceRange: { min: "", max: "" }, features: {}, notes: "" },
    ]);
  };

  const removePropertyPreference = (index: number) => {
    if (propertyPreferences.length > 1) {
      setPropertyPreferences(propertyPreferences.filter((_, i) => i !== index));
    }
  };

  const updatePropertyPreference = (index: number, updates: Partial<PropertyPreferenceForm>) => {
    setPropertyPreferences(
      propertyPreferences.map((pref, i) => (i === index ? { ...pref, ...updates } : pref))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Build propertyPreferences for the API
      const builtPreferences = propertyPreferences.map(pref => {
        const base = {
          propertyType: pref.propertyType,
          zones: pref.zones.filter(z => z.province || z.city || z.barrio),
          priceRange: {
            min: pref.priceRange.min ? Number(pref.priceRange.min) : undefined,
            max: pref.priceRange.max ? Number(pref.priceRange.max) : undefined,
          },
          notes: pref.notes || undefined,
        };

        // Add features based on property type
        if (pref.propertyType === "terreno" || pref.propertyType === "loteo") {
          return {
            ...base,
            features: {
              mtsFrente: pref.features.mtsFrente ? Number(pref.features.mtsFrente) : undefined,
              mtsFondo: pref.features.mtsFondo ? Number(pref.features.mtsFondo) : undefined,
              mtsTotales: pref.features.mtsTotales ? Number(pref.features.mtsTotales) : undefined,
            },
          };
        }

        if (pref.propertyType === "casa") {
          return {
            ...base,
            features: {
              bedrooms: pref.features.bedrooms ? Number(pref.features.bedrooms) : undefined,
              bathrooms: pref.features.bathrooms ? Number(pref.features.bathrooms) : undefined,
              mtsCubiertos: pref.features.mtsCubiertos ? Number(pref.features.mtsCubiertos) : undefined,
              mtsTotales: pref.features.mtsTotales ? Number(pref.features.mtsTotales) : undefined,
              garage: pref.features.garage,
              garageCount: pref.features.garageCount ? Number(pref.features.garageCount) : undefined,
              piso: pref.features.piso ? Number(pref.features.piso) : undefined,
              antiguedad: pref.features.antiguedad ? Number(pref.features.antiguedad) : undefined,
              estado: pref.features.estado,
            },
          };
        }

        if (pref.propertyType === "depto") {
          return {
            ...base,
            features: {
              bedrooms: pref.features.bedrooms ? Number(pref.features.bedrooms) : undefined,
              bathrooms: pref.features.bathrooms ? Number(pref.features.bathrooms) : undefined,
              mtsCubiertos: pref.features.mtsCubiertos ? Number(pref.features.mtsCubiertos) : undefined,
              mtsTotales: pref.features.mtsTotales ? Number(pref.features.mtsTotales) : undefined,
              garage: pref.features.garage,
              garageCount: pref.features.garageCount ? Number(pref.features.garageCount) : undefined,
              piso: pref.features.piso ? Number(pref.features.piso) : undefined,
              antiguedad: pref.features.antiguedad ? Number(pref.features.antiguedad) : undefined,
              estado: pref.features.estado,
              amenities: pref.features.amenities,
            },
          };
        }

        return base;
      });

      const body: any = {
        name,
        email,
        phone,
        status,
        source,
        location: location.province || location.city || location.barrio
          ? { province: location.province, city: location.city, barrio: location.barrio }
          : undefined,
        preferences: {
          operationType,
          propertyPreferences: builtPreferences,
        },
        notes,
      };

      // Agregar saleProperty si es venta
      if (operationType === "venta") {
        body.saleProperty = {
          propertyType: saleProperty.propertyType,
          address: saleProperty.address || undefined,
          googleMapsUrl: saleProperty.googleMapsUrl || undefined,
          price: saleProperty.price ? Number(saleProperty.price) : undefined,
          description: saleProperty.description || undefined,
          features: saleProperty.features,
          zones: saleProperty.zones.filter(z => z.province || z.city || z.barrio),
          notes: saleProperty.notes || undefined,
        };
      }

      const url = isEdit ? `/api/admin/clients/${client.id}` : "/api/admin/clients";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al guardar cliente");
      }

      const savedClient: ClientResponse = await res.json();

      toast.success(
        isEdit ? "Cliente actualizado correctamente" : "Cliente creado correctamente",
        {
          description: isEdit
            ? `Los datos de ${savedClient.name} han sido actualizados.`
            : `${savedClient.name} ha sido agregado a tu lista de clientes.`,
        }
      );

      if (isEdit && onUpdate) {
        onUpdate(savedClient);
        onClose();
      } else if (!isEdit && onCreate) {
        onCreate(savedClient);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Render features based on property type
  const renderFeatures = (pref: PropertyPreferenceForm, index: number) => {
    const updateFeature = (key: string, value: any) => {
      updatePropertyPreference(index, {
        features: { ...pref.features, [key]: value },
      });
    };

    if (pref.propertyType === "terreno" || pref.propertyType === "loteo") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">mts Frente</label>
            <input
              type="number"
              value={pref.features.mtsFrente || ""}
              onChange={(e) => updateFeature("mtsFrente", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">mts Fondo</label>
            <input
              type="number"
              value={pref.features.mtsFondo || ""}
              onChange={(e) => updateFeature("mtsFondo", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">mts Totales</label>
            <input
              type="number"
              value={pref.features.mtsTotales || ""}
              onChange={(e) => updateFeature("mtsTotales", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="200"
            />
          </div>
        </div>
      );
    }

    if (pref.propertyType === "casa") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Habitaciones</label>
              <select
                value={pref.features.bedrooms || ""}
                onChange={(e) => updateFeature("bedrooms", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Baños</label>
              <select
                value={pref.features.bathrooms || ""}
                onChange={(e) => updateFeature("bathrooms", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">mts Cubiertos</label>
              <input
                type="number"
                value={pref.features.mtsCubiertos || ""}
                onChange={(e) => updateFeature("mtsCubiertos", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">mts Totales</label>
              <input
                type="number"
                value={pref.features.mtsTotales || ""}
                onChange={(e) => updateFeature("mtsTotales", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="150"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pref.features.garage || false}
                  onChange={(e) => updateFeature("garage", e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-600">Cochera</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Antigüedad (años)</label>
              <input
                type="number"
                value={pref.features.antiguedad || ""}
                onChange={(e) => updateFeature("antiguedad", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Estado</label>
              <select
                value={pref.features.estado || ""}
                onChange={(e) => updateFeature("estado", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
                <option value="a_refaccionar">A refaccionar</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    if (pref.propertyType === "depto") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Habitaciones</label>
              <select
                value={pref.features.bedrooms || ""}
                onChange={(e) => updateFeature("bedrooms", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Baños</label>
              <select
                value={pref.features.bathrooms || ""}
                onChange={(e) => updateFeature("bathrooms", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">mts Cubiertos</label>
              <input
                type="number"
                value={pref.features.mtsCubiertos || ""}
                onChange={(e) => updateFeature("mtsCubiertos", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">mts Totales</label>
              <input
                type="number"
                value={pref.features.mtsTotales || ""}
                onChange={(e) => updateFeature("mtsTotales", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="60"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Piso</label>
              <input
                type="number"
                value={pref.features.piso || ""}
                onChange={(e) => updateFeature("piso", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Antigüedad (años)</label>
              <input
                type="number"
                value={pref.features.antiguedad || ""}
                onChange={(e) => updateFeature("antiguedad", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Estado</label>
              <select
                value={pref.features.estado || ""}
                onChange={(e) => updateFeature("estado", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
                <option value="a_refaccionar">A refaccionar</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pref.features.garage || false}
                  onChange={(e) => updateFeature("garage", e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-600">Cochera</span>
              </label>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">
          {isEdit ? "Editar Cliente" : "Nuevo Cliente"}
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
        {/* Datos básicos */}
        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">
            Datos del Cliente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="juan@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+54 9 11 1234 5678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ClientStatus)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={ClientStatus.ACTIVE}>Activo</option>
                <option value={ClientStatus.INACTIVE}>Inactivo</option>
                <option value={ClientStatus.CONVERTED}>Convertido</option>
                <option value={ClientStatus.LOST}>Perdido</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Fuente
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as ClientSource)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={ClientSource.WEB}>Web</option>
                <option value={ClientSource.REFERRAL}>Referido</option>
                <option value={ClientSource.PUBLISHED}>Publicado</option>
                <option value={ClientSource.OFFICE}>Oficina</option>
                <option value={ClientSource.OTHER}>Otro</option>
              </select>
            </div>

            {/* Ubicación del cliente */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Ubicación
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={location.province}
                  onChange={(e) => setLocation({ ...location, province: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provincia"
                />
                <input
                  type="text"
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Localidad"
                />
                <input
                  type="text"
                  value={location.barrio}
                  onChange={(e) => setLocation({ ...location, barrio: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Barrio"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tipo de operación */}
        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">
            Tipo de Operación
          </h3>
          <div className="flex gap-2">
            {(["compra", "venta", "alquiler"] as OperationTypeOption[]).map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => setOperationType(op)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  operationType === op
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {op.charAt(0).toUpperCase() + op.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Property Preferences - solo para compra/alquiler */}
        {operationType !== "venta" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-700 uppercase text-sm tracking-wider">
              Preferencias de Propiedad
            </h3>
            <button
              type="button"
              onClick={addPropertyPreference}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar tipo
            </button>
          </div>

          {propertyPreferences.map((pref, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Tipo de propiedad
                  </label>
                  <select
                    value={pref.propertyType}
                    onChange={(e) =>
                      updatePropertyPreference(index, {
                        propertyType: e.target.value as PropertyTypeOption,
                        features: {},
                      })
                    }
                    className="w-full md:w-48 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="terreno">Terreno</option>
                    <option value="casa">Casa</option>
                    <option value="loteo">Loteo</option>
                    <option value="depto">Departamento</option>
                  </select>
                </div>
                {propertyPreferences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePropertyPreference(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Ubicación (Provincia / Localidad / Barrio)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={pref.zones[0]?.province || ""}
                    onChange={(e) => {
                      const newZones = [...pref.zones];
                      if (!newZones[0]) newZones[0] = { province: "", city: "", barrio: "" };
                      newZones[0].province = e.target.value;
                      updatePropertyPreference(index, { zones: newZones });
                    }}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provincia"
                  />
                  <input
                    type="text"
                    value={pref.zones[0]?.city || ""}
                    onChange={(e) => {
                      const newZones = [...pref.zones];
                      if (!newZones[0]) newZones[0] = { province: "", city: "", barrio: "" };
                      newZones[0].city = e.target.value;
                      updatePropertyPreference(index, { zones: newZones });
                    }}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Localidad"
                  />
                  <input
                    type="text"
                    value={pref.zones[0]?.barrio || ""}
                    onChange={(e) => {
                      const newZones = [...pref.zones];
                      if (!newZones[0]) newZones[0] = { province: "", city: "", barrio: "" };
                      newZones[0].barrio = e.target.value;
                      updatePropertyPreference(index, { zones: newZones });
                    }}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Barrio"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Rango de precio (USD)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={pref.priceRange.min}
                    onChange={(e) =>
                      updatePropertyPreference(index, {
                        priceRange: { ...pref.priceRange, min: e.target.value },
                      })
                    }
                    placeholder="Min"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={pref.priceRange.max}
                    onChange={(e) =>
                      updatePropertyPreference(index, {
                        priceRange: { ...pref.priceRange, max: e.target.value },
                      })
                    }
                    placeholder="Max"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Features based on property type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Características
                </label>
                {renderFeatures(pref, index)}
              </div>

              {/* Notes for this property preference */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Info adicional de este tipo de propiedad
                </label>
                <textarea
                  value={pref.notes}
                  onChange={(e) => updatePropertyPreference(index, { notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Notas específicas sobre este tipo de propiedad..."
                />
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Sale Property - solo cuando es venta */}
        {operationType === "venta" && (
          <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
              🏠 Información de la Propiedad en Venta
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Tipo de propiedad</label>
                <select
                  value={saleProperty.propertyType}
                  onChange={(e) => setSaleProperty({ ...saleProperty, propertyType: e.target.value as PropertyTypeOption, features: {} })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="terreno">Terreno</option>
                  <option value="casa">Casa</option>
                  <option value="loteo">Loteo</option>
                  <option value="depto">Departamento</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Precio (USD)</label>
                <input
                  type="number"
                  value={saleProperty.price}
                  onChange={(e) => setSaleProperty({ ...saleProperty, price: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="150000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Dirección</label>
              <input
                type="text"
                value={saleProperty.address}
                onChange={(e) => setSaleProperty({ ...saleProperty, address: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Av. Siempre Viva 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Link de Google Maps</label>
              <input
                type="url"
                value={saleProperty.googleMapsUrl}
                onChange={(e) => setSaleProperty({ ...saleProperty, googleMapsUrl: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://maps.google.com/..."
              />
            </div>

            {/* Ubicación de la propiedad en venta */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Ubicación (Provincia / Localidad / Barrio)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={saleProperty.zones[0]?.province || ""}
                  onChange={(e) => {
                    const newZones = [...saleProperty.zones];
                    if (!newZones[0]) newZones[0] = { province: "", city: "", barrio: "" };
                    newZones[0].province = e.target.value;
                    setSaleProperty({ ...saleProperty, zones: newZones });
                  }}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provincia"
                />
                <input
                  type="text"
                  value={saleProperty.zones[0]?.city || ""}
                  onChange={(e) => {
                    const newZones = [...saleProperty.zones];
                    if (!newZones[0]) newZones[0] = { province: "", city: "", barrio: "" };
                    newZones[0].city = e.target.value;
                    setSaleProperty({ ...saleProperty, zones: newZones });
                  }}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Localidad"
                />
                <input
                  type="text"
                  value={saleProperty.zones[0]?.barrio || ""}
                  onChange={(e) => {
                    const newZones = [...saleProperty.zones];
                    if (!newZones[0]) newZones[0] = { province: "", city: "", barrio: "" };
                    newZones[0].barrio = e.target.value;
                    setSaleProperty({ ...saleProperty, zones: newZones });
                  }}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Barrio"
                />
              </div>
            </div>

            {/* Features según tipo de propiedad */}
            {(saleProperty.propertyType === "casa" || saleProperty.propertyType === "depto") && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Habitaciones</label>
                  <select
                    value={saleProperty.features.bedrooms || ""}
                    onChange={(e) => setSaleProperty({ ...saleProperty, features: { ...saleProperty.features, bedrooms: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Baños</label>
                  <select
                    value={saleProperty.features.bathrooms || ""}
                    onChange={(e) => setSaleProperty({ ...saleProperty, features: { ...saleProperty.features, bathrooms: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">mts Cubiertos</label>
                  <input
                    type="number"
                    value={saleProperty.features.mtsCubiertos || ""}
                    onChange={(e) => setSaleProperty({ ...saleProperty, features: { ...saleProperty.features, mtsCubiertos: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">mts Totales</label>
                  <input
                    type="number"
                    value={saleProperty.features.mtsTotales || ""}
                    onChange={(e) => setSaleProperty({ ...saleProperty, features: { ...saleProperty.features, mtsTotales: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="150"
                  />
                </div>
              </div>
            )}

            {(saleProperty.propertyType === "terreno" || saleProperty.propertyType === "loteo") && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">mts Frente</label>
                  <input
                    type="number"
                    value={saleProperty.features.mtsFrente || ""}
                    onChange={(e) => setSaleProperty({ ...saleProperty, features: { ...saleProperty.features, mtsFrente: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">mts Fondo</label>
                  <input
                    type="number"
                    value={saleProperty.features.mtsFondo || ""}
                    onChange={(e) => setSaleProperty({ ...saleProperty, features: { ...saleProperty.features, mtsFondo: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">mts Totales</label>
                  <input
                    type="number"
                    value={saleProperty.features.mtsTotales || ""}
                    onChange={(e) => setSaleProperty({ ...saleProperty, features: { ...saleProperty.features, mtsTotales: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="200"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Descripción adicional</label>
              <textarea
                value={saleProperty.description}
                onChange={(e) => setSaleProperty({ ...saleProperty, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Descripción de la propiedad..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Notas internas</label>
              <textarea
                value={saleProperty.notes}
                onChange={(e) => setSaleProperty({ ...saleProperty, notes: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Notas sobre esta venta..."
              />
            </div>
          </div>
        )}

        {/* General Notes */}
        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">
            Notas Adicionales del Cliente
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Notas generales sobre el cliente..."
          />
        </div>

        {/* Buttons */}
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
            {isEdit ? "Guardar Cambios" : "Crear Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClientForm;
