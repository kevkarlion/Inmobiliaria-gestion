"use client";

import { PropertyResponse } from "@/dtos/property/property-response.dto";
import { ExternalLink } from "lucide-react";

interface Props {
  property: PropertyResponse;
  onDelete: (slug: string) => void;
  onEdit: (property: PropertyResponse) => void;
}

export default function PropertyActions({ property, onDelete, onEdit }: Props) {
  const siteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.riquelmeprop.com'}/propiedad/${property.slug}`;

  return (
    <div className="grid grid-cols-3 border-t border-slate-100">
      <a
        href={siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="py-3 text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors border-r border-slate-100 flex items-center justify-center gap-1"
      >
        <ExternalLink size={14} />
        Ver sitio
      </a>
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