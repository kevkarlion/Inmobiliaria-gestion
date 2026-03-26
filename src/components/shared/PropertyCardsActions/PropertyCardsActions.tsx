"use client";

import { PropertyResponse } from "@/dtos/property/property-response.dto";
import { ExternalLink, Edit, Trash2 } from "lucide-react";

interface Props {
  property: PropertyResponse;
  onDelete: (slug: string) => void;
  onEdit: (property: PropertyResponse) => void;
  currentUser?: { id: string; isAdmin?: boolean } | null;
}

export default function PropertyActions({ property, onDelete, onEdit, currentUser }: Props) {
  const siteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.riquelmeprop.com'}/propiedad/${property.slug}`;
  const canEdit = currentUser?.isAdmin || property.createdBy?.userId === currentUser?.id;

  return (
    <div className="grid grid-cols-3 border-t border-slate-100">
      <a
        href={siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center py-3 text-slate-500 hover:text-gold-sand hover:bg-slate-50 transition-colors text-xs font-medium"
      >
        <ExternalLink size={14} className="mr-1.5" />
        Ver
      </a>
      
      {canEdit && (
        <button
          onClick={() => onEdit(property)}
          className="flex items-center justify-center py-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs font-medium border-l border-r border-slate-100"
        >
          <Edit size={14} className="mr-1.5" />
          Editar
        </button>
      )}
      
      {canEdit && (
        <button
          onClick={() => onDelete(property.slug)}
          className="flex items-center justify-center py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors text-xs font-medium"
        >
          <Trash2 size={14} className="mr-1.5" />
          Eliminar
        </button>
      )}
      
      {!canEdit && (
        <div className="flex items-center justify-center py-3 text-slate-400 text-xs col-span-2">
          Solo lectura
        </div>
      )}
    </div>
  );
}