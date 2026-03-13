import { RequirementResponse } from "@/dtos/requirement/requirement-response.dto";
import { RequirementStatus } from "@/domain/enums/requirement-status.enum";
import { MapPin, Calendar, Edit, Trash2, Building2 } from "lucide-react";

interface Props {
  requirement: RequirementResponse;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RequirementCard({ requirement, onEdit, onDelete }: Props) {
  // Status badge
  const statusConfig = {
    [RequirementStatus.ACTIVE]: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Activo" },
    [RequirementStatus.MATCHED]: { bg: "bg-blue-100", text: "text-blue-700", label: "Con Coincidencias" },
    [RequirementStatus.FULFILLED]: { bg: "bg-purple-100", text: "text-purple-700", label: "Cumplido" },
    [RequirementStatus.CANCELLED]: { bg: "bg-slate-100", text: "text-slate-600", label: "Cancelado" },
    [RequirementStatus.EXPIRED]: { bg: "bg-red-100", text: "text-red-700", label: "Expirado" },
  };

  // Priority badge
  const priorityConfig = {
    low: { bg: "bg-slate-100", text: "text-slate-600", label: "Baja" },
    medium: { bg: "bg-amber-100", text: "text-amber-700", label: "Media" },
    high: { bg: "bg-red-100", text: "text-red-700", label: "Alta" },
  };

  const status = statusConfig[requirement.status] || statusConfig[RequirementStatus.ACTIVE];
  const priority = priorityConfig[requirement.priority as keyof typeof priorityConfig] || priorityConfig.medium;

  // Format price
  const formatPrice = (min: number, max?: number) => {
    const format = (p: number) =>
      p >= 1000000
        ? `$${(p / 1000000).toFixed(1)}M`
        : `$${(p / 1000).toFixed(0)}K`;

    if (max) return `${format(min)} - ${format(max)}`;
    return `Desde ${format(min)}`;
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-slate-400" />
          <span className="font-bold text-slate-800 capitalize">
            {requirement.operationType === "venta" ? "Compra" : "Alquiler"}
          </span>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
            </button>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`${status.bg} ${status.text} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
          {status.label}
        </span>
        <span className={`${priority.bg} ${priority.text} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
          Prioridad {priority.label}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-slate-400 text-xs">Precio:</span>
          <p className="font-medium text-slate-700">
            {formatPrice(requirement.priceRange.min, requirement.priceRange.max)}
          </p>
        </div>
        <div>
          <span className="text-slate-400 text-xs">Habitaciones:</span>
          <p className="font-medium text-slate-700">{requirement.features.bedrooms}+</p>
        </div>
        <div>
          <span className="text-slate-400 text-xs">Baños:</span>
          <p className="font-medium text-slate-700">{requirement.features.bathrooms}+</p>
        </div>
        <div>
          <span className="text-slate-400 text-xs">Mínimo m²:</span>
          <p className="font-medium text-slate-700">{requirement.features.minM2} m²</p>
        </div>
      </div>

      {/* Zones */}
      {requirement.zones.length > 0 && (
        <div className="flex items-start gap-1 mb-3">
          <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {requirement.zones.map((zone, idx) => (
              <span key={idx} className="text-xs text-slate-500">
                {zone.city?.name || zone.province?.name}
                {zone.barrio && ` (${zone.barrio})`}
                {idx < requirement.zones.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {requirement.notes && (
        <p className="text-xs text-slate-500 italic mb-3 border-t pt-2">
          {requirement.notes}
        </p>
      )}

      {/* Date */}
      <div className="flex items-center gap-1 text-[10px] text-slate-400">
        <Calendar className="w-3 h-3" />
        <span>Creado: {formatDate(requirement.createdAt)}</span>
      </div>
    </div>
  );
}
