/* eslint-disable @typescript-eslint/no-explicit-any */
// app/properties/PropertyCard.tsx

import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Car, Layers, Home } from "lucide-react";
import { PropertyImageResolver } from "@/components/shared/PropertyImageResolver/PropertyImageResolver";

const isLandType = (typeSlug?: string) => 
  typeSlug === "terreno" || typeSlug === "loteo" || typeSlug === "lote";

export default function PropertyCard({ property }: any) {
  const operationColor =
    property.operationType === "venta" ? "bg-gold-sand" : "bg-blue-600";
  
  const typeSlug = property.propertyType?.slug;
  const isLand = isLandType(typeSlug);

  // Obtener las imágenes según el dispositivo (con fallback)
  const images = property.images || [];
  const imagesDesktop = property.imagesDesktop || [];
  const imagesMobile = property.imagesMobile || [];
  const hasImage = images.length > 0 || imagesDesktop.length > 0 || imagesMobile.length > 0;

  return (
    <Link href={`/properties/${property.slug}`}>
      <div className="group relative bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:border-gold-sand/40 transition-all duration-300">

        {/* IMAGEN */}
        <div className="relative h-48 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {hasImage ? (
            <PropertyImageResolver
              images={images}
              imagesDesktop={imagesDesktop}
              imagesMobile={imagesMobile}
              alt={property.title}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Layers className="w-12 h-12 text-neutral-300" />
            </div>
          )}
          
          {/* Overlay con operación */}
          <div className="absolute top-3 left-3">
            <span className={`${operationColor} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}>
              {property.operationType === "venta" ? "Venta" : "Alquiler"}
            </span>
          </div>

          {/* Flags en esquina */}
          {(property.flags?.featured ||
            property.flags?.opportunity ||
            property.flags?.premium) && (
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              {property.flags.premium && (
                <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Premium
                </span>
              )}
              {property.flags.opportunity && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  Oportunidad
                </span>
              )}
              {property.flags.featured && (
                <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Destacada
                </span>
              )}
            </div>
          )}

          {/* Gradiente inferior */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>

        {/* CONTENIDO */}
        <div className="p-4 space-y-3">

          {/* Título y tipo */}
          <div>
            <p className="text-gold-sand text-[10px] font-bold uppercase tracking-widest mb-1">
              {property.propertyType?.name || "Propiedad"}
            </p>
            <h2 className="font-semibold text-lg leading-tight text-neutral-900 dark:text-white group-hover:text-gold-sand transition-colors line-clamp-2">
              {property.title}
            </h2>
          </div>

          {/* Dirección */}
          {(property.address?.street || property.zone?.name) && (
            <div className="flex items-start gap-1.5 text-neutral-500 dark:text-neutral-400 text-sm">
              <MapPin className="w-4 h-4 shrink-0 text-gold-sand/70 mt-0.5" />
              <span className="line-clamp-1">
                {property.address?.street
                  ? `${property.address.street} ${property.address.number ?? ""}`
                  : ""}
                {property.zone?.name ? ` • ${property.zone.name}` : ""}
              </span>
            </div>
          )}

          {/* Features - Icons row */}
          <div className="flex items-center gap-4 py-2 border-y border-neutral-100 dark:border-neutral-800">
            {/* Ambientes - solo si NO es terreno/loteo */}
            {!isLand && property.features?.bedrooms !== undefined && (
              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 text-sm">
                <BedDouble className="w-4 h-4 text-gold-sand" />
                <span>{property.features.bedrooms} <span className="text-xs text-neutral-400">Dorm</span></span>
              </div>
            )}
            {property.features?.bathrooms !== undefined && !isLand && (
              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 text-sm">
                <Bath className="w-4 h-4 text-gold-sand" />
                <span>{property.features.bathrooms} <span className="text-xs text-neutral-400">Baño</span></span>
              </div>
            )}
            {property.features?.garage && !isLand && (
              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 text-sm">
                <Car className="w-4 h-4 text-gold-sand" />
                <span className="text-xs text-neutral-400">Garage</span>
              </div>
            )}
            {/* M2 Cubiertos */}
            {property.features?.coveredM2 !== undefined && property.features.coveredM2 > 0 && (
              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 text-sm">
                <Home className="w-4 h-4 text-gold-sand" />
                <span>{property.features.coveredM2} <span className="text-xs text-neutral-400">m²</span></span>
              </div>
            )}
            {/* M2 Total / Terreno */}
            {property.features?.totalM2 !== undefined && property.features.totalM2 > 0 && (
              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 text-sm">
                <Layers className="w-4 h-4 text-gold-sand" />
                <span>{property.features.totalM2} <span className="text-xs text-neutral-400">m²</span></span>
              </div>
            )}
          </div>

          {/* Tags */}
          {property.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {property.tags.slice(0, 3).map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700"
                >
                  {tag}
                </span>
              ))}
              {property.tags.length > 3 && (
                <span className="text-[10px] text-neutral-400">+{property.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Precio */}
          {property.price && (
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-xl font-bold text-neutral-900 dark:text-white">
                {(property.price.priceOption === "consult" || property.price.amount === 0) ? (
                  <span className="text-gold-sand text-sm font-semibold">Consultar Precio</span>
                ) : (
                  <>
                    <span className="text-gold-sand text-sm font-semibold mr-1">
                      {property.price.currency}
                    </span>
                    {property.price.amount.toLocaleString("es-AR")}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
