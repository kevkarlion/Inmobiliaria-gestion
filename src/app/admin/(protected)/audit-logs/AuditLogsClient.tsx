"use client";

import { useState } from "react";
import { AuditLogResponse } from "@/dtos/audit/audit-log-response.dto";
import { Search, FileText, User, Building2, Users, Clock, Filter } from "lucide-react";

interface Props {
  initialLogs: AuditLogResponse[];
}

const entityIcons: Record<string, any> = {
  user: User,
  property: Building2,
  client: Users,
  requirement: FileText,
};

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  activate: "bg-green-100 text-green-700",
  deactivate: "bg-orange-100 text-orange-700",
};

export default function AuditLogsClient({ initialLogs }: Props) {
  const [logs] = useState<AuditLogResponse[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEntity, setFilterEntity] = useState<string>("");
  const [filterAction, setFilterAction] = useState<string>("");

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEntity = !filterEntity || log.entity === filterEntity;
    const matchesAction = !filterAction || log.action === filterAction;

    return matchesSearch && matchesEntity && matchesAction;
  });

  const actionLabels: Record<string, string> = {
    create: "Creado",
    update: "Actualizado",
    delete: "Eliminado",
    activate: "Activado",
    deactivate: "Desactivado",
  };

  return (
    <div className="p-3 md:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg md:text-xl font-bold text-white">Auditoría</h1>
        <p className="text-xs md:text-sm text-white hidden sm:block">Registro de acciones del sistema</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          />
        </div>

        <div className="flex gap-1.5">
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className={`px-2 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              filterEntity ? "text-slate-900" : "text-slate-400"
            }`}
          >
            <option value="" className="bg-white text-slate-400">
              Entidad
            </option>
            <option value="user" className="bg-white text-slate-900">
              Usuarios
            </option>
            <option value="property" className="bg-white text-slate-900">
              Propiedades
            </option>
            <option value="client" className="bg-white text-slate-900">
              Clientes
            </option>
          </select>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className={`px-2 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              filterAction ? "text-slate-900" : "text-slate-400"
            }`}
          >
            <option value="" className="bg-white text-slate-400">
              Acción
            </option>
            <option value="create" className="bg-white text-slate-900">
              Crear
            </option>
            <option value="update" className="bg-white text-slate-900">
              Actualizar
            </option>
            <option value="delete" className="bg-white text-slate-900">
              Eliminar
            </option>
            <option value="activate" className="bg-white text-slate-900">
              Activar
            </option>
            <option value="deactivate" className="bg-white text-slate-900">
              Desactivar
            </option>
          </select>
        </div>
      </div>

      {/* Logs List - compact cards */}
      <div className="space-y-2">
        {filteredLogs.map((log) => {
          const EntityIcon = entityIcons[log.entity] || FileText;
          
          return (
            <div
              key={log.id}
              className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                {/* Icon */}
                <div className={`p-1.5 rounded ${actionColors[log.action] || "bg-slate-100"} shrink-0`}>
                  <EntityIcon className="w-3.5 h-3.5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium ${actionColors[log.action]}`}>
                      {actionLabels[log.action] || log.action}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400">•</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 capitalize">{log.entity}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-900 font-medium mb-1 line-clamp-2">{log.description}</p>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="max-w-[120px] sm:max-w-[200px] truncate">{log.userEmail}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLogs.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 text-center text-xs sm:text-sm text-slate-500">
          No se encontraron registros
        </div>
      )}

      <div className="mt-4 text-center text-xs text-slate-400">
        Admin &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
