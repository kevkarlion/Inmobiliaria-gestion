import React from "react";
import { PropertyResponse } from "@/dtos/property/property-response.dto";
import { MapPin, Maximize, Phone, Tag, Hash } from "lucide-react";
import PropertyActions from "@/components/shared/PropertyCardsActions/PropertyCardsActions"; // Importamos el componente de cliente

interface Props {
  property: PropertyResponse;
  onDelete: (slug: string) => void;
  onEdit: (property: PropertyResponse) => void;
}

export default function PropertyCardAdmin({ property, onDelete, onEdit }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Header: ID y Slugs */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
        <span className="text-[10px] font-mono text-slate-400 truncate flex items-center gap-1">
          <Hash size={12} /> {property.id}
        </span>
        <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium uppercase">
          {property.propertyType?.name}
        </span>
      </div>

      <div className="p-4 grow">
        {/* Flags de Marketing */}
        <div className="flex gap-1 mb-3">
          {property.flags?.featured && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full border border-amber-200">Destacada</span>}
          {property.flags?.opportunity && <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full border border-rose-200">Oportunidad</span>}
          {property.flags?.premium && <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full border border-purple-200">Premium</span>}
        </div>

        <h2 className="text-lg font-bold text-slate-800 leading-tight mb-1">{property.title}</h2>
        <p className="text-xs text-slate-400 mb-3 font-mono">/{property.slug}</p>

        {/* Detalles en Grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            <span className="truncate">{property.address.street} {property.address.number}</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize size={16} className="text-slate-400" />
            <span>{property.features.totalM2 || property.features.coveredM2} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-slate-400" />
            <span>{property.contactPhone || 'Sin tel.'}</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Tag size={16} className="text-blue-500" />
            <span>{property.price.currency} {property.price.amount.toLocaleString("es-AR")}</span>
          </div>
        </div>

        {/* Info extra rápida */}
        <div className="flex gap-4 text-[11px] text-slate-500 border-t pt-3">
          <span>Hab: <b>{property.features.bedrooms}</b></span>
          <span>Baños: <b>{property.features.bathrooms}</b></span>
          <span>Cochera: <b>{property.features.garage ? 'Sí' : 'No'}</b></span>
          <span>Antigüedad: <b>{property.features.age} años</b></span>
        </div>
      </div>

      {/* Botones de Acción (Hidratados en el cliente) */}
      <PropertyActions 
        property={property} 
        onDelete={onDelete} 
        onEdit={onEdit} 
      />
    </div>
  );
}