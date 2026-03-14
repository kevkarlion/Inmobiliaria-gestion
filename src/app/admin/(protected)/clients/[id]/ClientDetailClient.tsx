"use client";

import { useState, useEffect } from "react";
import { ClientResponse } from "@/dtos/client/client-response.dto";
import { ClientStatus } from "@/domain/enums/client-status.enum";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Users,
  Loader2,
} from "lucide-react";

interface ClientMatchResult {
  clientId: string;
  clientName: string;
  score: number;
  operationMatch: boolean;
  propertyTypeMatch: boolean;
  zoneMatch: boolean;
  priceOverlap: boolean;
}

interface Props {
  client: ClientResponse;
}

export default function ClientDetailClient({ client }: Props) {
  const [similarClients, setSimilarClients] = useState<ClientMatchResult[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  // Cargar clientes similares
  useEffect(() => {
    async function fetchSimilarClients() {
      try {
        const res = await fetch(`/api/admin/clients/${client.id}/matches`);
        if (res.ok) {
          const data = await res.json();
          setSimilarClients(data.matches || []);
        }
      } catch (error) {
        console.error("Error fetching similar clients:", error);
      } finally {
        setLoadingMatches(false);
      }
    }
    fetchSimilarClients();
  }, [client.id]);

  // Status badge
  const statusConfig = {
    [ClientStatus.ACTIVE]: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Activo" },
    [ClientStatus.INACTIVE]: { bg: "bg-slate-100", text: "text-slate-600", label: "Inactivo" },
    [ClientStatus.CONVERTED]: { bg: "bg-blue-100", text: "text-blue-700", label: "Convertido" },
    [ClientStatus.LOST]: { bg: "bg-red-100", text: "text-red-700", label: "Perdido" },
  };

  const status = statusConfig[client.status] || statusConfig[ClientStatus.ACTIVE];

  // Format price range
  const formatPrice = (min: number, max?: number) => {
    const format = (p: number) =>
      p >= 1000000
        ? `$${(p / 1000000).toFixed(1)}M`
        : `$${(p / 1000).toFixed(0)}K`;

    if (max) return `${format(min)} - ${format(max)}`;
    return `Desde ${format(min)}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20 md:p-8 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver a Clientes</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-slate-900 p-4 rounded-xl">
                <User className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
                  {client.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`${status.bg} ${status.text} text-xs px-3 py-1 rounded-full font-medium`}>
                    {status.label}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                    {client.source}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Email</p>
                <p className="font-medium text-slate-700">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Teléfono</p>
                <p className="font-medium text-slate-700">{client.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Cliente desde</p>
                <p className="font-medium text-slate-700">{formatDate(client.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferencias - solo para compra/alquiler */}
        {client.preferences.operationType !== "venta" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider">
            Preferencias de Búsqueda
          </h2>
          
          {/* Operation Type */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Operación</p>
              <p className="font-bold text-slate-700 capitalize">
                {client.preferences.operationType === "venta" 
                  ? "Venta" 
                  : client.preferences.operationType === "alquiler" 
                    ? "Alquiler" 
                    : "Compra"}
              </p>
            </div>
          </div>

          {/* Property Preferences */}
          {client.preferences.propertyPreferences && client.preferences.propertyPreferences.length > 0 && (
            <div className="space-y-4">
              {client.preferences.propertyPreferences.map((pref, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium capitalize">
                      {pref.propertyType}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Price */}
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Presupuesto</p>
                      <p className="font-bold text-slate-700 text-sm">
                        {formatPrice(pref.priceRange?.min || 0, pref.priceRange?.max)}
                      </p>
                    </div>
                    
                    {/* Casa/Depто features */}
                    {(pref.propertyType === "casa" || pref.propertyType === "depto") && pref.features && (
                      <>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Habitaciones</p>
                          <p className="font-bold text-slate-700 text-sm">
                            {String((pref.features as any).bedrooms || "-")}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Baños</p>
                          <p className="font-bold text-slate-700 text-sm">
                            {String((pref.features as any).bathrooms || "-")}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">mts²</p>
                          <p className="font-bold text-slate-700 text-sm">
                            {String((pref.features as any).mtsTotales || (pref.features as any).mtsCubiertos || "-")}
                          </p>
                        </div>
                      </>
                    )}
                    
                    {/* Terreno/Loteo features */}
                    {(pref.propertyType === "terreno" || pref.propertyType === "loteo") && pref.features && (
                      <>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">mts² Totales</p>
                          <p className="font-bold text-slate-700 text-sm">
                            {String((pref.features as any).mtsTotales || "-")}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">mts Frente</p>
                          <p className="font-bold text-slate-700 text-sm">
                            {String((pref.features as any).mtsFrente || "-")}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">mts Fondo</p>
                          <p className="font-bold text-slate-700 text-sm">
                            {String((pref.features as any).mtsFondo || "-")}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Zones for this preference */}
                  {pref.zones && pref.zones.length > 0 && (
                    <div className="mt-3 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                      <div className="flex flex-wrap gap-2">
                        {pref.zones.map((zone, zIdx) => {
                          // Usar cityName o provinceName guardados directamente, o los del populate
                          const cityName = zone.cityName || zone.city?.name || "";
                          const provinceName = zone.provinceName || zone.province?.name || "";
                          const displayName = cityName || provinceName;
                          
                          if (!displayName) return null;
                          
                          return (
                            <span
                              key={zIdx}
                              className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full"
                            >
                              {displayName}
                              {zone.barrio && ` (${zone.barrio})`}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Notes for this preference */}
                  {pref.notes && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Notas</p>
                      <p className="text-slate-600 text-sm">{pref.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* General Notes */}
          {client.notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Notas del Cliente</p>
              <p className="text-slate-600">{client.notes}</p>
            </div>
          )}
        </div>
        )}

        {/* Información de venta */}
        {client.preferences.operationType === "venta" && client.saleProperty && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              🏠 Propiedad en Venta
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Tipo</p>
                <p className="font-bold text-slate-700 capitalize">{client.saleProperty.propertyType}</p>
              </div>
              {client.saleProperty.price && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Precio</p>
                  <p className="font-bold text-slate-700">{formatPrice(client.saleProperty.price)}</p>
                </div>
              )}
              {client.saleProperty.address && (
                <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Dirección</p>
                  <p className="font-bold text-slate-700">{client.saleProperty.address}</p>
                </div>
              )}
            </div>

            {client.saleProperty.googleMapsUrl && (
              <div className="mb-4">
                <a
                  href={client.saleProperty.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  📍 Ver en Google Maps
                </a>
              </div>
            )}

            {/* Features */}
            {client.saleProperty.features && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {(client.saleProperty.propertyType === "casa" || client.saleProperty.propertyType === "depto") && (
                  <>
                    {(client.saleProperty.features as any).bedrooms && (
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Habitaciones</p>
                        <p className="font-bold text-slate-700">{(client.saleProperty.features as any).bedrooms}</p>
                      </div>
                    )}
                    {(client.saleProperty.features as any).bathrooms && (
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Baños</p>
                        <p className="font-bold text-slate-700">{(client.saleProperty.features as any).bathrooms}</p>
                      </div>
                    )}
                    {(client.saleProperty.features as any).mtsCubiertos && (
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">mts Cub.</p>
                        <p className="font-bold text-slate-700">{(client.saleProperty.features as any).mtsCubiertos}</p>
                      </div>
                    )}
                    {(client.saleProperty.features as any).mtsTotales && (
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">mts Tot.</p>
                        <p className="font-bold text-slate-700">{(client.saleProperty.features as any).mtsTotales}</p>
                      </div>
                    )}
                  </>
                )}
                {(client.saleProperty.propertyType === "terreno" || client.saleProperty.propertyType === "loteo") && (
                  <>
                    {(client.saleProperty.features as any).mtsTotales && (
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">mts² Totales</p>
                        <p className="font-bold text-slate-700">{(client.saleProperty.features as any).mtsTotales}</p>
                      </div>
                    )}
                    {(client.saleProperty.features as any).mtsFrente && (
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">mts Frente</p>
                        <p className="font-bold text-slate-700">{(client.saleProperty.features as any).mtsFrente}</p>
                      </div>
                    )}
                    {(client.saleProperty.features as any).mtsFondo && (
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">mts Fondo</p>
                        <p className="font-bold text-slate-700">{(client.saleProperty.features as any).mtsFondo}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {client.saleProperty.description && (
              <div className="mb-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Descripción</p>
                <p className="text-slate-600">{client.saleProperty.description}</p>
              </div>
            )}

            {client.saleProperty.notes && (
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Notas internas</p>
                <p className="text-slate-600">{client.saleProperty.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Clientes con intereses similares */}
        {similarClients.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-5 h-5" />
              Clientes con Intereses Similares
            </h2>
            <div className="space-y-3">
              {similarClients.map((match) => (
                <Link
                  key={match.clientId}
                  href={`/admin/clients/${match.clientId}`}
                  className="block p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{match.clientName}</p>
                      <div className="flex gap-2 mt-1">
                        {match.propertyTypeMatch && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Mismo tipo
                          </span>
                        )}
                        {match.zoneMatch && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Misma zona
                          </span>
                        )}
                        {match.priceOverlap && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                            Precio similar
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-600">
                        {Math.round(match.score * 100)}%
                      </span>
                      <p className="text-xs text-slate-400">compatibilidad</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {loadingMatches && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-2 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Buscando clientes con intereses similares...</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pb-6 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            Admin System &copy; {new Date().getFullYear()} - Riquelme Propiedades
          </p>
        </footer>
      </div>
    </div>
  );
}
