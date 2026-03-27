"use client";

import { useState } from "react";
import { ClientResponse } from "@/dtos/client/client-response.dto";
import { ClientStatus } from "@/domain/enums/client-status.enum";
import { ClientSource } from "@/domain/enums/client-source.enum";
import { ClientForm } from "@/components/shared/ClientForm/ClientForm";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Building2,
  User,
} from "lucide-react";

interface Props {
  client: ClientResponse;
  onUpdate: (client: ClientResponse) => void;
  onDelete: (id: string) => void;
}

export default function ClientCardAdmin({ client, onUpdate, onDelete }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Status badge
  const statusConfig = {
    [ClientStatus.ACTIVE]: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Activo" },
    [ClientStatus.INACTIVE]: { bg: "bg-slate-100", text: "text-slate-600", label: "Inactivo" },
    [ClientStatus.CONVERTED]: { bg: "bg-blue-100", text: "text-blue-700", label: "Convertido" },
    [ClientStatus.LOST]: { bg: "bg-red-100", text: "text-red-700", label: "Perdido" },
  };

  // Source badge
  const sourceConfig = {
    [ClientSource.WEB]: { bg: "bg-purple-100", text: "text-purple-700", label: "Web" },
    [ClientSource.REFERRAL]: { bg: "bg-amber-100", text: "text-amber-700", label: "Referido" },
    [ClientSource.PUBLISHED]: { bg: "bg-cyan-100", text: "text-cyan-700", label: "Publicado" },
    [ClientSource.OFFICE]: { bg: "bg-slate-100", text: "text-slate-700", label: "Oficina" },
    [ClientSource.OTHER]: { bg: "bg-slate-100", text: "text-slate-600", label: "Otro" },
  };

  const status = statusConfig[client.status] || statusConfig[ClientStatus.ACTIVE];
  const source = sourceConfig[client.source] || sourceConfig[ClientSource.OTHER];

  // Formatear fecha
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format price range
  const formatPrice = (min: number, max?: number) => {
    const format = (p: number) =>
      p >= 1000000
        ? `$${(p / 1000000).toFixed(1)}M`
        : `$${(p / 1000).toFixed(0)}K`;

    if (max) return `${format(min)} - ${format(max)}`;
    return `Desde ${format(min)}`;
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 truncate text-sm">{client.name}</h3>
            <p className="text-[10px] text-slate-400 font-mono truncate">{client.id}</p>
          </div>

          {/* Menú de acciones */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10 min-w-[160px]">
                <button
                  onClick={() => {
                    setShowEditForm(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <Link
                  href={`/admin/clients/${client.id}`}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Ver Detalle
                </Link>
                <button
                  onClick={() => {
                    onDelete(client.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-3 grow">
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className={`${status.bg} ${status.text} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
              {status.label}
            </span>
            <span className={`${source.bg} ${source.text} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
              {source.label}
            </span>
          </div>

          {/* Contacto */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{client.phone}</span>
            </div>
            {client.location && (client.location.province || client.location.city || client.location.barrio) && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate text-xs">
                  {[client.location.city, client.location.province].filter(Boolean).join(", ")}
                  {client.location.barrio && ` (${client.location.barrio})`}
                </span>
              </div>
            )}
          </div>

          {/* Preferencias */}
          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Preferencias
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Operación:</span>
                <span className="font-medium text-slate-700 capitalize">
                  {client.preferences.operationType === "venta" 
                    ? "Venta" 
                    : client.preferences.operationType === "alquiler" 
                      ? "Alquiler" 
                      : "Compra"}
                </span>
              </div>
              
              {/* Show sale property info for venta, or preferences for compra/alquiler */}
              {(client.preferences.operationType === "venta" && client.saleProperty && client.saleProperty.price) ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tipo:</span>
                    <span className="font-medium text-slate-700 capitalize">
                      {client.saleProperty.propertyType || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Precio:</span>
                    <span className="font-medium text-green-600">
                      {client.saleProperty.price ? formatPrice(client.saleProperty.price) : "-"}
                    </span>
                  </div>
                  {client.saleProperty.address && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dirección:</span>
                      <span className="font-medium text-slate-700 text-right truncate max-w-[120px]">
                        {client.saleProperty.address}
                      </span>
                    </div>
                  )}
                  {/* Show zones for saleProperty */}
                  {client.saleProperty.zones && client.saleProperty.zones.length > 0 && (
                    <div className="flex items-start gap-1 mt-2">
                      <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-slate-500 truncate">
                        {client.saleProperty.zones
                          .map((z) => {
                            const cityName = z.city?.name || z.cityName || "";
                            const provinceName = z.province?.name || z.provinceName || "";
                            const name = cityName || provinceName;
                            return name ? `${name}${z.barrio ? ` (${z.barrio})` : ""}` : "";
                          })
                          .filter(Boolean)
                          .join(", ") || "Sin zona"}
                      </span>
                    </div>
                  )}
                </>
              ) : (client.preferences.propertyPreferences && client.preferences.propertyPreferences.length > 0) ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tipo:</span>
                    <span className="font-medium text-slate-700 capitalize">
                      {client.preferences.propertyPreferences[0].propertyType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Precio:</span>
                    <span className="font-medium text-slate-700">
                      {formatPrice(
                        client.preferences.propertyPreferences[0].priceRange?.min || 0,
                        client.preferences.propertyPreferences[0].priceRange?.max
                      )}
                    </span>
                  </div>
                  {/* Show bedrooms for casa/depto */}
                  {(client.preferences.propertyPreferences[0].propertyType === "casa" || 
                    client.preferences.propertyPreferences[0].propertyType === "depto") && 
                   client.preferences.propertyPreferences[0].features && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Habitaciones:</span>
                      <span className="font-medium text-slate-700">
                        {String((client.preferences.propertyPreferences[0].features as any).bedrooms || "-")}
                      </span>
                    </div>
                  )}
                  {/* Show m2 for terreno/loteo */}
                  {(client.preferences.propertyPreferences[0].propertyType === "terreno" || 
                    client.preferences.propertyPreferences[0].propertyType === "loteo") && 
                   client.preferences.propertyPreferences[0].features && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">mts²:</span>
                      <span className="font-medium text-slate-700">
                        {String((client.preferences.propertyPreferences[0].features as any).mtsTotales || "-")}
                      </span>
                    </div>
                  )}
                </>
              ) : null}
              
              {/* Show zones if available */}
              {client.preferences.propertyPreferences && 
               client.preferences.propertyPreferences[0]?.zones && 
               client.preferences.propertyPreferences[0].zones.length > 0 && (
                <div className="flex items-start gap-1 mt-2">
                  <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-500 truncate">
                    {client.preferences.propertyPreferences[0].zones
                      .map((z) => {
                        const cityName = z.cityName || z.city?.name || "";
                        const provinceName = z.provinceName || z.province?.name || "";
                        const name = cityName || provinceName;
                        return name ? `${name}${z.barrio ? ` (${z.barrio})` : ""}` : "";
                      })
                      .filter(Boolean)
                      .join(", ") || "Sin zona"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Fechas */}
          <div className="flex gap-4 text-[11px] text-slate-400 border-t pt-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Creado: {formatDate(client.createdAt)}</span>
            </div>
            {client.createdBy && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{client.createdBy.email.split('@')[0]}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL EDICIÓN */}
      {showEditForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl">
            <ClientForm
              client={client}
              onClose={() => setShowEditForm(false)}
              onUpdate={onUpdate}
            />
          </div>
        </div>
      )}
    </>
  );
}
