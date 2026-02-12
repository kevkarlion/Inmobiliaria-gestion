"use client";

import { PropertyResponse } from "@/dtos/property/property-response.dto";

interface Props {
  property: PropertyResponse;
  onDelete: (slug: string) => void;
  onEdit: (property: PropertyResponse) => void;
}

export default function PropertyActions({ property, onDelete, onEdit }: Props) {
  return (
    <div className="grid grid-cols-2 border-t border-slate-100">
      <button
        onClick={() => onEdit(property)}
        className="py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-r border-slate-100"
      >
        Editar
      </button>
      <button
        onClick={() => onDelete(property.slug)}
        className="py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
      >
        Eliminar
      </button>
    </div>
  );
}