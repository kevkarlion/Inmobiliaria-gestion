"use client";

import { ClientStatus } from "@/domain/enums/client-status.enum";
import { ClientSource } from "@/domain/enums/client-source.enum";
import { Filter, ChevronDown } from "lucide-react";

interface Props {
  statusFilter: ClientStatus | "all";
  sourceFilter: ClientSource | "all";
  onStatusChange: (status: ClientStatus | "all") => void;
  onSourceChange: (source: ClientSource | "all") => void;
}

export default function ClientFilters({
  statusFilter,
  sourceFilter,
  onStatusChange,
  onSourceChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-600">Filtros:</span>
      </div>

      {/* Filter by Status */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as ClientStatus | "all")}
          className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">Todos los estados</option>
          <option value={ClientStatus.ACTIVE}>Activo</option>
          <option value={ClientStatus.INACTIVE}>Inactivo</option>
          <option value={ClientStatus.CONVERTED}>Convertido</option>
          <option value={ClientStatus.LOST}>Perdido</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>

      {/* Filter by Source */}
      <div className="relative">
        <select
          value={sourceFilter}
          onChange={(e) => onSourceChange(e.target.value as ClientSource | "all")}
          className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">Todas las fuentes</option>
          <option value={ClientSource.WEB}>Web</option>
          <option value={ClientSource.REFERRAL}>Referido</option>
          <option value={ClientSource.PUBLISHED}>Publicado</option>
          <option value={ClientSource.OFFICE}>Oficina</option>
          <option value={ClientSource.OTHER}>Otro</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>

      {/* Clear filters */}
      {(statusFilter !== "all" || sourceFilter !== "all") && (
        <button
          onClick={() => {
            onStatusChange("all");
            onSourceChange("all");
          }}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
