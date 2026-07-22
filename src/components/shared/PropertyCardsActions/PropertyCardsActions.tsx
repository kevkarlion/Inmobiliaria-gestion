"use client";

import { PropertyResponse } from "@/dtos/property/property-response.dto";
import { ExternalLink, Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  property: PropertyResponse;
  onDelete: (slug: string) => void;
  onEdit: (property: PropertyResponse) => void;
  currentUser?: { id: string; isAdmin?: boolean } | null;
}

export default function PropertyActions({ property, onDelete, onEdit, currentUser }: Props) {
  const siteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.riquelmeprop.com'}/propiedad/${property.slug}`;
  const canEdit = currentUser?.isAdmin || property.createdBy?.userId === currentUser?.id;
  const [toggling, setToggling] = useState(false);

  async function handleToggleActive() {
    setToggling(true);
    try {
      const res = await fetch(`/api/properties/${property.slug}/toggle-active`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json();
        // Force parent re-render by toggling the page
        window.location.reload();
        toast.success(updated.isActive ? "Propiedad activada" : "Propiedad desactivada");
      } else {
        toast.error("Error al cambiar estado");
      }
    } catch {
      toast.error("Error al cambiar estado");
    } finally {
      setToggling(false);
    }
  }

  if (canEdit) {
    return (
      <div className="grid grid-cols-4 border-t border-slate-100">
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center py-3 text-slate-500 hover:text-gold-sand hover:bg-slate-50 transition-colors text-xs font-medium"
        >
          <ExternalLink size={14} className="mr-1.5" />
          Ver
        </a>
        
        <button
          onClick={handleToggleActive}
          disabled={toggling}
          className="flex items-center justify-center py-3 transition-colors text-xs font-medium border-l border-slate-100"
          title={property.isActive === false ? "Activar propiedad" : "Desactivar propiedad"}
        >
          {toggling ? (
            <Loader2 size={14} className="animate-spin text-slate-400" />
          ) : (
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-medium ${property.isActive === false ? 'text-slate-400' : 'text-green-600'}`}>
                {property.isActive === false ? 'Off' : 'On'}
              </span>
              <div
                className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors"
                style={{
                  backgroundColor: property.isActive === false ? '#e2e8f0' : '#22c55e'
                }}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${
                    property.isActive === false ? 'translate-x-[2px]' : 'translate-x-[14px]'
                  }`}
                />
              </div>
            </div>
          )}
        </button>
        
        <button
          onClick={() => onEdit(property)}
          className="flex items-center justify-center py-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs font-medium border-l border-slate-100"
        >
          <Edit size={14} className="mr-1.5" />
          Editar
        </button>
        
        <button
          onClick={() => onDelete(property.slug)}
          className="flex items-center justify-center py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors text-xs font-medium border-l border-slate-100"
        >
          <Trash2 size={14} className="mr-1.5" />
          Eliminar
        </button>
      </div>
    );
  }

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
      
      <div className="flex items-center justify-center py-3 text-slate-400 text-xs col-span-2">
        Solo lectura
      </div>
    </div>
  );
}